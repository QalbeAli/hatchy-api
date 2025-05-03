import { ethers } from "ethers";
import { admin } from "../firebase/firebase";

// Initialize Firebase admin SDK

class WalletService {
  private walletUsersCollection = admin.firestore().collection("wallet-users");
  private usersCollection = admin.firestore().collection("users");

  public async setInternalWallet(uid: string): Promise<void> {
    // Fetch user data
    const userSnapshot = await this.usersCollection.doc(uid).get();
    const userData = userSnapshot.data();

    if (!userData) {
      console.warn(`User ${uid} does not exist.`);
      return;
    }

    // Check if the user already has an internal wallet
    const internalWalletSnapshot = await this.walletUsersCollection
      .where("userId", "==", uid)
      .where("isInternalWallet", "==", true)
      .limit(1)
      .get();

    if (!internalWalletSnapshot.empty) {
      // User already has an internal wallet
      const internalWalletData = internalWalletSnapshot.docs[0].data();
      await this.usersCollection.doc(uid).update({
        internalWallet: internalWalletData.address,
      });
      console.log(`Set internal wallet for user ${uid}: ${internalWalletData.address}`);
      return;
    }

    // Create a new internal wallet if none exists
    const newWallet = ethers.Wallet.createRandom();
    const walletAddress = newWallet.address;
    const walletPrivateKey = newWallet.privateKey;
    const walletPublicKey = newWallet.publicKey;
    const walletSeedPhrase = newWallet.mnemonic.phrase;

    const walletData = {
      address: walletAddress,
      privateKey: walletPrivateKey,
      publicKey: walletPublicKey,
      seedPhrase: walletSeedPhrase,
      userId: uid,
      mainWallet: false, // Assuming it's not the main wallet
      isInternalWallet: true,
    };

    // Save wallet data to Firestore
    await this.walletUsersCollection.doc(walletAddress).set(walletData);
    await this.usersCollection.doc(uid).update({
      internalWallet: walletAddress,
    });

    console.log(`Created and set internal wallet for user ${uid}: ${walletAddress}`);
  }

  public async processAllUsers(): Promise<void> {
    const auth = admin.auth();
    let nextPageToken: string | undefined;

    do {
      // Fetch a batch of users
      const listUsersResult = await auth.listUsers(1000, nextPageToken);
      for (const userRecord of listUsersResult.users) {
        const uid = userRecord.uid;
        try {
          await this.setInternalWallet(uid);
        } catch (error) {
          console.error(`Error processing user ${uid}:`, error.message);
        }
      }
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    console.log("Finished processing all users.");
  }
}

// Run the script
(async () => {
  const walletService = new WalletService();
  await walletService.processAllUsers();
})();