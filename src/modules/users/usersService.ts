import { Transaction } from "firebase-admin/firestore";
import { BadRequestError } from "../../errors/bad-request-error";
import { NotFoundError } from "../../errors/not-found-error";
import { admin } from "../../firebase/firebase";
import { LeaderboardService } from "../leaderboard/leaderboard-service";
import { User } from "./user";
import { Wallet } from "./wallet";
import { TradesService } from "../trades/trades-service";
import { ethers } from "ethers";
import { UltigenService } from "../ultigen/ultigen-service";

export type UserCreationParams = Pick<
  User,
  "uid" | "email" | "displayName" | "picture" | "disabled"
>;

export class UsersService {
  walletUsersCollection = admin.firestore().collection('wallet-users');
  private usersCollection = admin.firestore().collection('users');
  private referralRelationsCollection = admin.firestore().collection('referral-relationships');
  private gameSavesCollection = admin.firestore().collection('game-saves');
  private vouchersCollection = admin.firestore().collection('vouchers');
  private leaderboardService = new LeaderboardService();

  public async getUserByLinkedWallet(address: string): Promise<User> {
    const wallet = await this.walletUsersCollection.doc(address).get();
    if (!wallet.exists) {
      throw new NotFoundError("Wallet not found");
    }
    return await this.get(wallet.data()?.userId);
  }

  public async getUserByEmail(email: string, transaction?: Transaction): Promise<User> {
    if (transaction) {
      const user = await transaction.get(this.usersCollection.where('email', '==', email));
      if (user.docs.length === 0) {
        throw new NotFoundError("User not found");
      }
      return user.docs[0]?.data() as User;
    }
    const user = await this.usersCollection.where('email', '==', email).get();
    if (user.docs.length === 0) {
      throw new NotFoundError("User not found");
    }
    return user.docs[0]?.data() as User;
  }
  public async get(uid: string, transaction?: admin.firestore.Transaction): Promise<User> {
    if (transaction) {
      const user = (await transaction.get(this.usersCollection.doc(uid))).data();
      return user as User;
    }
    const user = (await this.usersCollection.doc(uid).get()).data();
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
    const updateData = {}
    if (body.displayName) {
      updateData['displayName'] = body.displayName;
    }
    if (body.bio) {
      updateData['bio'] = body.bio;
    }
    if (body.referralCode) {
      updateData['referralCode'] = body.referralCode;
    }
    await this.usersCollection.doc(uid).update(updateData);
    if (body.displayName) {
      // update display name in ranks
      await this.leaderboardService.updateUserRankDisplayName(uid, body.displayName);
      const tradesService = new TradesService();
      await tradesService.updateUsername(uid, body.displayName);
    }
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
      return admin.firestore().runTransaction(async (transaction) => {
        // with transaction
        const userDoc = await transaction.get(this.usersCollection.doc(userId));
        if (!userDoc.exists) {
          throw new BadRequestError("User not found");
        }
        const userData = userDoc.data();
        if (userData.referrerId) {
          const referrerRef = this.usersCollection.doc(userData.referrerId);
          // using transaction
          const referrerDoc = await transaction.get(referrerRef);
          if (!referrerDoc.exists) {
            throw new BadRequestError("Referrer not found");
          }
          transaction.update(referrerRef, {
            referralCount: admin.firestore.FieldValue.increment(-1),
            // If you're using XP points, decrease them as well
            xpPoints: admin.firestore.FieldValue.increment(-100) // Adjust the amount as needed
          });
        }

        // 3. Get all referral relationships where user is either referrer or referred
        const [asReferrerDocs, asReferredDocs] = await Promise.all([
          this.referralRelationsCollection.where('referrerId', '==', userId).get(),
          this.referralRelationsCollection.where('referredId', '==', userId).get()
        ]);

        // Delete all referral relationships
        asReferrerDocs.docs.forEach(doc => {
          transaction.delete(doc.ref);
        });
        asReferredDocs.docs.forEach(doc => {
          transaction.delete(doc.ref);
        });

        // set referred user document referrerId to null
        asReferredDocs.docs.forEach(doc => {
          const referredUserData = doc.data();
          if (referredUserData) {
            transaction.update(this.usersCollection.doc(referredUserData.referredId), {
              referrerId: null
            });
          }
        });

        // 4. Get and delete all game saves
        const gameSavesDocs = await this.gameSavesCollection
          .where('userId', '==', userId).get();

        gameSavesDocs.docs.forEach(doc => {
          transaction.delete(doc.ref);
        });

        // 5. Get and delete vouchers
        const vouchersDocs = await this.vouchersCollection
          .where('userId', '==', userId).get();

        vouchersDocs.docs.forEach(doc => {
          transaction.update(doc.ref, {
            email: userData.email
          })
        });

        // 6. Delete linked wallets
        const walletUsersDocs = await this.walletUsersCollection
          .where('userId', '==', userId).get();

        walletUsersDocs.docs.forEach(doc => {
          if (doc.data().isInternalWallet) {
            transaction.update(doc.ref, {
              email: userData.email,
            });
          } else {
            transaction.delete(doc.ref);
          }
        });

        // 6. Delete user document
        transaction.delete(this.usersCollection.doc(userId));

        // 8. Delete Firebase Auth user (this must be done after batch commit as it's a separate system)
        await admin.auth().deleteUser(userId);

        console.log(`Successfully deleted account and all related data for user: ${userId}`);

      });
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
    if (wallets.empty) {
      return [];
    }
    return wallets.docs.map((doc) => ({
      userId: doc.data().userId,
      address: doc.data().address,
      mainWallet: doc.data().mainWallet,
      isInternalWallet: doc.data().isInternalWallet,
    } as Wallet));
  }

  public async createWallet(
    uid: string,
  ): Promise<Wallet> {
    // create a new ethereum wallet and save it to the database
    // save the address, private key, public key and seed phrase in the wallet-users collection
    // also set it as the main wallet for the user
    // do this only if the user has not a main wallet already
    const linkedWallets = await this.getLinkedWallets(uid);
    if (linkedWallets.length > 0) {
      throw new BadRequestError("User already has a wallet linked");
    }

    const newWallet = ethers.Wallet.createRandom();
    const walletAddress = newWallet.address;
    const walletPrivateKey = newWallet.privateKey;
    const walletPublicKey = newWallet.publicKey;
    const walletSeedPhrase = newWallet.mnemonic.phrase;
    const walletData: Wallet = {
      address: walletAddress,
      privateKey: walletPrivateKey,
      publicKey: walletPublicKey,
      seedPhrase: walletSeedPhrase,
      userId: uid,
      mainWallet: true,
      isInternalWallet: true,
    };
    await this.walletUsersCollection.doc(walletAddress).set(walletData);
    await this.usersCollection.doc(uid).update({
      mainWallet: walletAddress,
    });
    return walletData;
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
    if (currentMainWallet.isInternalWallet) {
      const ultigenService = new UltigenService();
      const internalWallet = await this.walletUsersCollection.doc(currentMainWallet.address).get();
      await ultigenService.transferUltigenAssets(
        internalWallet.data() as Wallet,
        mainWallet
      )
      await this.walletUsersCollection.doc(currentMainWallet.address).delete();
    } else {
      if (!!currentMainWallet?.address) {
        await this.walletUsersCollection.doc(currentMainWallet?.address).update({
          mainWallet: false,
        });
      }
    }
    await this.usersCollection.doc(uid).update({
      mainWallet,
    });


    await this.walletUsersCollection.doc(mainWallet).update({
      mainWallet: true,
    });
    return await this.get(uid);
  }

  public async searchUsers(query: string): Promise<User> {
    // search all users whose display name or email contains the query
    const users = await this.usersCollection
      .where('email', '==', query)
      .get();
    return users.docs.map((doc) => doc.data() as User)[0];
  }

}