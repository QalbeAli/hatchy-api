import { admin } from "../../firebase/firebase";
import { Timestamp, Transaction } from "firebase-admin/firestore";
import { Game } from "../games/game";
import { User } from "../users/user";
import { ScoreItem } from "./score";
import { RankItem } from "./rank";
import { getContract, getSigner } from "../contracts/networks";
import { BigNumber, ethers, Wallet } from "ethers";
import { Wallet as WalletUser } from "../users/wallet";
import config from "../../config";

export class LeaderboardService {
  walletUsersCollection = admin.firestore().collection('wallet-users');
  chainId = 8198;

  public async addScore(game: Game, user: User, score: number): Promise<ScoreItem> {
    await this.addScoreToContract(game, user, score);

    const AddedScoreRef = await admin.firestore().runTransaction(async (transaction) => {
      const scoresRef = admin.firestore().collection('scores');
      const querySnapshot = await transaction.get(scoresRef
        .where('gameId', '==', game.uid)
        .where('userId', '==', user.uid)
        .limit(1));

      if (!querySnapshot.empty) {
        const existingScoreDoc = querySnapshot.docs[0];
        const existingScore = existingScoreDoc.data().score;
        const scoreData = existingScoreDoc.data();
        const now = Timestamp.now();
        if (score > existingScore) {
          transaction.update(existingScoreDoc.ref, {
            score: score,
            updatedAt: now,
          });
        }
        // return {
        //   gameId: scoreData.gameId,
        //   userId: scoreData.userId,
        //   username: scoreData.username,
        //   score: score > existingScore ? score : existingScore,
        //   createdAt: scoreData.createdAt,
        //   updatedAt: score > existingScore ? now : scoreData.updatedAt,
        // };
        return existingScoreDoc.ref;

      } else {
        const newScoreRef = scoresRef.doc();
        const scoreData = {
          gameId: game.uid,
          userId: user.uid,
          username: user.displayName,
          score,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
        }
        transaction.set(newScoreRef, scoreData);


        return newScoreRef;
      }
    });
    const doc = await AddedScoreRef.get();
    return doc.data() as ScoreItem;
  }

  public async addScoreToContract(game: Game, user: User, score: number): Promise<void> {
    const internalWalletAddress = user.internalWallet || ethers.constants.AddressZero;
    const internalWalletData = (await this.walletUsersCollection.doc(internalWalletAddress).get()).data() as WalletUser;
    const userWallet = getSigner(this.chainId, internalWalletData.privateKey);

    const gameLeaderboardContract = getContract('gameLeaderboard', this.chainId, true, userWallet);
    const nonce = BigNumber.from(ethers.utils.randomBytes(32));

    const signature = await this.getSetScoreSignature(
      internalWalletAddress,
      game.uid,
      BigNumber.from(score),
      nonce,
    );
    const payload = [
      internalWalletAddress,
      game.uid,
      BigNumber.from(score),
      nonce,
      signature
    ]

    try {
      // calculate gas limit
      let totalGasLimit = await gameLeaderboardContract.estimateGas.setMyHighScore(payload);

      // Add a buffer to the gas limit
      totalGasLimit = totalGasLimit.mul(3);

      // Fetch the current gas price from the provider
      const gasPrice = await userWallet.provider.getGasPrice();
      const totalCost = totalGasLimit.mul(gasPrice);

      // get balance of the wallet
      const balance = await userWallet.getBalance();
      if (balance.lt(totalCost)) {
        // Transfer gas amount to fromAddress
        const apiSigner = getSigner(this.chainId);
        const tx = await apiSigner.sendTransaction({
          to: userWallet.address,
          value: totalCost,
        });
        await tx.wait();
      }

      await gameLeaderboardContract.setMyHighScore(payload);
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed transaction');
    }
  }

  async getSetScoreSignature(
    user: string,
    gameId: string,
    newScore: BigNumber,
    nonce: BigNumber,
  ) {
    const provider = new ethers.providers.JsonRpcProvider(config.JSON_RPC_URL);
    const signer = new Wallet(config.MASTERS_SIGNER_KEY, provider);
    const hash = ethers.utils.solidityKeccak256(
      ['address', 'string', 'uint256', 'uint'],
      [user, gameId, newScore, nonce]);

    const signature = await signer.signMessage(ethers.utils.arrayify(hash));
    return signature;
  }

  public async getScoreLeaderboard(gameId: string, limit?: number, transaction?: Transaction): Promise<ScoreItem[]> {
    const querySnapshot = transaction != null ?
      await transaction.get(admin.firestore().collection('scores')
        .where('gameId', '==', gameId)
        .orderBy('score', 'desc')
        .limit(limit || 10)) :
      await admin.firestore().collection('scores')
        .where('gameId', '==', gameId)
        .orderBy('score', 'desc')
        .limit(limit || 10)
        .get();

    return querySnapshot.docs.map((doc) => ({
      userId: doc.data().userId,
      gameId: doc.data().gameId,
      username: doc.data().username,
      createdAt: doc.data().createdAt,
      updatedAt: doc.data().updatedAt,
      score: doc.data().score,
    }));
  }

  public async getUserScore(gameId: string, userId: string): Promise<ScoreItem> {
    const querySnapshot = await admin.firestore().collection('scores')
      .where('gameId', '==', gameId)
      .where('userId', '==', userId)
      .limit(1)
      .get();
    if (querySnapshot.empty) {
      return null;
    }
    const doc = querySnapshot.docs[0];
    return {
      userId: doc.data().userId,
      gameId: doc.data().gameId,
      username: doc.data().username,
      createdAt: doc.data().createdAt,
      updatedAt: doc.data().updatedAt,
      score: doc.data().score,
    };
  }

  public async updateRank(game: Game, user: User, rank: number): Promise<RankItem> {
    const collection = admin.firestore().collection('ranks');
    const querySnapshot = await collection
      .where('gameId', '==', game.uid)
      .where('userId', '==', user.uid)
      .limit(1)
      .get();

    if (!querySnapshot.empty) {
      const existingRankDoc = querySnapshot.docs[0];
      const rankData = existingRankDoc.data();
      const now = admin.firestore.FieldValue.serverTimestamp();
      await existingRankDoc.ref.update({
        rank,
        updatedAt: now,
      });

      const rankDoc = await existingRankDoc.ref.get();
      return rankDoc.data() as RankItem;
    } else {
      const collectionDoc = collection.doc();
      const userRank = {
        gameId: game.uid,
        userId: user.uid,
        rank,
        username: user.displayName || 'User',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      await collectionDoc.set(userRank);
      const userRankDoc = await collectionDoc.get();
      return userRankDoc.data() as RankItem;
    }
  }

  public async getRankLeaderboard(gameId: string, limit?: number): Promise<RankItem[]> {
    const querySnapshot = await admin.firestore().collection('ranks')
      .where('gameId', '==', gameId)
      .orderBy('rank', 'desc')
      .limit(limit || 10)
      .get();
    return querySnapshot.docs.map((doc) => ({
      gameId: doc.data().gameId,
      userId: doc.data().userId,
      rank: doc.data().rank,
      username: doc.data().username,
      createdAt: doc.data().createdAt,
      updatedAt: doc.data().updatedAt,
    }));
  }

  public async getUserRank(gameId: string, userId: string): Promise<RankItem> {
    const querySnapshot = await admin.firestore().collection('ranks')
      .where('gameId', '==', gameId)
      .where('userId', '==', userId)
      .limit(1)
      .get();
    if (querySnapshot.empty) {
      return null;
    }
    const doc = querySnapshot.docs[0];
    return {
      userId: doc.data().userId,
      gameId: doc.data().gameId,
      username: doc.data().username,
      createdAt: doc.data().createdAt,
      updatedAt: doc.data().updatedAt,
      rank: doc.data().rank,
    };
  }

  public async updateUserRankDisplayName(userId: string, displayName: string): Promise<void> {
    const querySnapshot = await admin.firestore().collection('ranks')
      .where('userId', '==', userId)
      .get();
    if (!querySnapshot.empty) {
      querySnapshot.docs.forEach(async (doc) => {
        await doc.ref.update({
          username: displayName,
        });
      });
    }

    const querySnapshotScores = await admin.firestore().collection('scores')
      .where('userId', '==', userId)
      .get();
    if (!querySnapshotScores.empty) {
      querySnapshotScores.docs.forEach(async (doc) => {
        await doc.ref.update({
          username: displayName,
        });
      });
    }
  }
}