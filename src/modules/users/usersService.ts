import { BadRequestError } from "../../errors/bad-request-error";
import { NotFoundError } from "../../errors/not-found-error";
import { admin } from "../../firebase/firebase";
import { User } from "./user";
import { Wallet } from "./wallet";

export type UserCreationParams = Pick<
  User,
  "uid" | "email" | "displayName" | "picture" | "disabled"
>;

export class UsersService {
  collection = admin.firestore().collection('users');
  walletUsersCollection = admin.firestore().collection('wallet-users');
  private usersCollection = admin.firestore().collection('users');
  private referralRelationsCollection = admin.firestore().collection('referral-relationships');
  private gameSavesCollection = admin.firestore().collection('game-saves');
  private vouchersCollection = admin.firestore().collection('vouchers');

  public async getUserByLinkedWallet(address: string): Promise<User> {
    const wallet = await this.walletUsersCollection.doc(address).get();
    if (!wallet.exists) {
      throw new NotFoundError("Wallet not found");
    }
    return await this.get(wallet.data()?.userId);
  }

  public async getUserByEmail(email: string): Promise<User> {
    const user = await this.collection.where('email', '==', email).get();
    if (user.docs.length === 0) {
      throw new NotFoundError("User not found");
    }
    return user.docs[0]?.data() as User;
  }
  public async get(uid: string): Promise<User> {
    const user = (await this.collection.doc(uid).get()).data();
    return user as User;
  }

  public async update(
    uid: string,
    body: {
      displayName?: string;
      bio?: string;
      referralCode?: string;
    }
  ): Promise<User> {
    await this.collection.doc(uid).update({
      displayName: body.displayName,
      bio: body.bio,
      referralCode: body.referralCode,
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
        if ((await referrerRef.get()).exists) {
          batch.update(referrerRef, {
            referralCount: admin.firestore.FieldValue.increment(-1),
            // If you're using XP points, decrease them as well
            xpPoints: admin.firestore.FieldValue.increment(-100) // Adjust the amount as needed
          });
        }
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

      // 6. Delete linked wallets
      const walletUsersDocs = await this.walletUsersCollection
        .where('userId', '==', userId)
        .get();

      walletUsersDocs.docs.forEach(doc => {
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

  public async getLinkedWallets(uid: string): Promise<Wallet[]> {
    const wallets = await this.walletUsersCollection.where('userId', '==', uid).get();
    return wallets.docs.map((doc) => doc.data() as Wallet);
  }

  public async setMainWallet(
    uid: string,
    mainWallet: string,
  ): Promise<User> {
    const linkedWallets = await this.getLinkedWallets(uid);
    const currentMainWallet = linkedWallets.find((wallet) => wallet.mainWallet);
    const hasAddress = linkedWallets.some(
      (wallet) => wallet.address === mainWallet,
    );
    if (!hasAddress) {
      throw new NotFoundError("Address not found in user wallets");
    }
    await this.collection.doc(uid).update({
      mainWallet,
    });

    await this.walletUsersCollection.doc(currentMainWallet?.address).update({
      mainWallet: false,
    });

    await this.walletUsersCollection.doc(mainWallet).update({
      mainWallet: true,
    });
    return await this.get(uid);
  }

  public async searchUsers(query: string): Promise<User> {
    // search all users whose display name or email contains the query
    const users = await this.collection
      .where('email', '==', query)
      .get();
    return users.docs.map((doc) => doc.data() as User)[0];
  }

}