import { BadRequestError } from "../../errors/bad-request-error";
import { NotFoundError } from "../../errors/not-found-error";
import { admin } from "../../firebase/firebase";
import { User } from "./user";

export type UserCreationParams = Pick<
  User,
  "uid" | "email" | "displayName" | "picture" | "disabled"
>;

export class UsersService {
  collection = admin.firestore().collection('users');
  private usersCollection = admin.firestore().collection('users');
  private referralRelationsCollection = admin.firestore().collection('referral-relationships');
  private gameSavesCollection = admin.firestore().collection('game-saves');
  private vouchersCollection = admin.firestore().collection('vouchers');

  public async get(uid: string): Promise<User> {
    const user = (await this.collection.doc(uid).get()).data();
    return user as User;
  }

  public async update(
    uid: string,
    body: {
      displayName?: string;
      bio?: string;
    }
  ): Promise<User> {
    await this.collection.doc(uid).update({
      ...body
    });
    return await this.get(uid);
  }

  /**
   * Deletes a user account and all associated data
   * This includes:
   * - Firebase Auth user
   * - Firestore user document
   * - Referral relationships
   * - Updates referrer's stats
   * - Game saves
   */
  public async deleteAccount(userId: string): Promise<void> {
    try {
      // Start a batch write
      const batch = admin.firestore().batch();

      // 1. Get user data to check for referrer
      const userDoc = await this.usersCollection.doc(userId).get();
      const userData = userDoc.data();

      if (!userData) {
        throw new BadRequestError("User not found");
      }

      // 2. If user was referred, decrease referrer's count
      if (userData.referrerId) {
        const referrerRef = this.usersCollection.doc(userData.referrerId);
        batch.update(referrerRef, {
          referralCount: admin.firestore.FieldValue.increment(-1),
          // If you're using XP points, decrease them as well
          xpPoints: admin.firestore.FieldValue.increment(-100) // Adjust the amount as needed
        });
      }

      // 3. Get all referral relationships where user is either referrer or referred
      const [asReferrerDocs, asReferredDocs] = await Promise.all([
        this.referralRelationsCollection
          .where('referrerId', '==', userId)
          .get(),
        this.referralRelationsCollection
          .where('referredId', '==', userId)
          .get()
      ]);

      // Delete all referral relationships
      asReferrerDocs.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      asReferredDocs.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // set referred user document referrerId to null
      asReferredDocs.docs.forEach(doc => {
        const referredUserData = doc.data();
        if (referredUserData) {
          batch.update(this.usersCollection.doc(referredUserData.referredId), {
            referrerId: null
          });
        }
      });

      // 4. Get and delete all game saves
      const gameSavesDocs = await this.gameSavesCollection
        .where('userId', '==', userId)
        .get();

      gameSavesDocs.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // 5. Get and delete vouchers
      const vouchersDocs = await this.vouchersCollection
        .where('userId', '==', userId)
        .get();

      vouchersDocs.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // 6. Delete user document
      batch.delete(this.usersCollection.doc(userId));

      // 7. Execute batch operations
      await batch.commit();

      // 8. Delete Firebase Auth user (this must be done after batch commit as it's a separate system)
      await admin.auth().deleteUser(userId);

      console.log(`Successfully deleted account and all related data for user: ${userId}`);

    } catch (error) {
      console.error('Error deleting account:', error);

      // Add specific error handling
      if (error.code === 'auth/user-not-found') {
        throw new BadRequestError("User not found in authentication system");
      }

      throw error;
    }
  }

  public async setRewardReceiverAddress(
    uid: string,
    rewardReceiverAddress: string,
  ): Promise<User> {
    const user = await this.get(uid);
    const hasAddress = user.wallets.some(
      (wallet) => wallet.address === rewardReceiverAddress,
    );
    if (!hasAddress) {
      throw new NotFoundError("Address not found in user wallets");
    }
    await this.collection.doc(uid).update({
      rewardReceiverAddress,
    });
    return await this.get(uid);
  }

}