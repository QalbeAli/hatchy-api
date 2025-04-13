import { ethers } from "ethers";
import { admin } from "../firebase/firebase";

// Initialize Firebase admin SDK

class WalletService {
  private walletUsersCollection = admin.firestore().collection("wallet-users");
  private usersCollection = admin.firestore().collection("users");

  public async createWallet(uid: string): Promise<void> {
    // Check if the user already has a linked wallet
    const userSnapshot = await this.usersCollection.doc(uid).get();
    const userData = userSnapshot.data();
    if (userData?.mainWallet) {
      console.log(`User ${uid} already has a main wallet: ${userData.mainWallet}`);
      return;
    }

    // Create a new Ethereum wallet
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
      mainWallet: true,
      isInternalWallet: true,
    };

    // Save wallet data to Firestore
    await this.walletUsersCollection.doc(walletAddress).set(walletData);
    await this.usersCollection.doc(uid).update({
      mainWallet: walletAddress,
    });

    console.log(`Created wallet for user ${uid}: ${walletAddress}`);
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
          await this.createWallet(uid);
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