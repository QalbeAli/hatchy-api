import { admin } from "../../firebase/firebase";
import { AssetsService } from "../assets/assets-service";
import { GamesService } from "../games/games-service";
import { LeaderboardService } from "../leaderboard/leaderboard-service";
import { UsersService } from "../users/usersService";
import { VouchersService } from "../vouchers/vouchers-service";
import { CreateEventParams } from "./create-event-params";
import { Event } from "./event";

export class EventsService {
  eventsCollection = admin.firestore().collection('events');
  assetsService = new AssetsService();

  public async getEvents(): Promise<Event[]> {
    const snapshot = await this.eventsCollection.get();
    return snapshot.docs.map(doc => doc.data() as Event);
  }

  public async createEvent(event: CreateEventParams): Promise<Event> {
    const docRef = this.eventsCollection.doc();
    const uid = docRef.id;
    await docRef.set({
      uid,
      ...event
    });
    return {
      ...event,
      uid
    };
  }

  public async deleteEvent(uid: string): Promise<void> {
    await this.eventsCollection.doc(uid).delete();
  }

  public async giveEventRewards(): Promise<void> {
    console.log('Giving event rewards...');
    const snapshot = await this.eventsCollection
      .where('endDate', '<', new Date().toISOString())
      .where('rewardsGiven', '==', false)
      .get();
    if (snapshot.empty) {
      console.log('No events to process');
      return;
    }

    const leaderboardService = new LeaderboardService();
    const vouchersService = new VouchersService();
    const gamesService = new GamesService();
    const usersService = new UsersService();

    await Promise.all(snapshot.docs.map(async (doc) => {
      const event = doc.data() as Event;
      let leaderboard = [];
      // Get leaderboard based on game type
      if (event.gameId) {
        const game = await gamesService.getGameById(event.gameId);
        if (!game.name.includes('Rampage')) {
          // Get regular game leaderboard
          leaderboard = await leaderboardService.getScoreLeaderboard(event.gameId);
        } else {
          // Get Rampage game leaderboard
          const rampageSnapshot = await admin.firestore()
            .collection('HatchyRampageGameLeaderboards')
            .orderBy('EnemiesKilled', 'desc')
            .get();

          leaderboard = rampageSnapshot.docs.map(doc => ({
            userId: doc.data().Uid,
            score: doc.data().EnemiesKilled,
            username: doc.data().DisplayName
          }));
        }

        // Prepare all voucher operations
        const voucherOperations = event.rewards.flatMap(reward => {
          const qualifyingUsers = leaderboard.slice(reward.fromRank - 1, reward.toRank);
          return qualifyingUsers.flatMap(user =>
            reward.assets.map(asset => ({
              userId: user.userId,
              assetId: asset.uid,
              amount: asset.amount,
              username: user.username,
              type: asset.type
            }))
          );
        });

        // Process vouchers in batches of 500
        const BATCH_SIZE = 100;
        for (let i = 0; i < voucherOperations.length; i += BATCH_SIZE) {
          const batch = voucherOperations.slice(i, i + BATCH_SIZE);
          await Promise.all(batch.map(async (op) => {
            try {
              if (op.type == 'game') {
                const asset = await this.assetsService.getAsset(op.assetId);
                const property = asset.property;
                if (asset.name.includes('Rampage')) {
                  // update document in collection HatchyRampageGameData
                  // increase the property value by op.amount
                  const rampageGameDataRef = admin.firestore().collection('HatchyRampageGameData').doc(op.userId);
                  await rampageGameDataRef.set({
                    [property]: admin.firestore.FieldValue.increment(op.amount)
                  }, { merge: true });
                }
              } else {
                const result = await vouchersService.giveVoucherToUser(
                  op.userId,
                  op.assetId,
                  op.amount
                );
                // Get user data for logging
                const user = await usersService.get(op.userId);

                if (user && result.voucher) {
                  // Log the voucher operation
                  await vouchersService.logVoucher({
                    action: 'giveaway',
                    vouchersData: [{
                      ...result.voucher,
                      amount: op.amount
                    }],
                    toUserId: user.uid,
                    toUserEmail: user.email,
                    actionUserId: 'system',
                    actionUserEmail: 'system@hatchypocket.com'
                  });
                }
              }
              // console.log(`Gave ${op.amount}x ${op.assetId} to ${op.username}`);
            } catch (error) {
              console.error(`Failed to give reward to ${op.username}:`, error);
            }
          }));
        }
      }

      // Mark event as completed
      await doc.ref.update({
        rewardsGiven: true
      });

      console.log(`Processed event ${event.uid}: ${event.name}`);
    }));
  }
}
