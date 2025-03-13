import { NotFoundError } from "../../errors/not-found-error";
import { admin } from "../../firebase/firebase";
import { Timestamp, Transaction } from "firebase-admin/firestore";
import { GameWallet } from "./game-wallet";

export class GamesWalletsService {
  collection = admin.firestore().collection('game-wallets');
  public async getGameWalletById(gameId: string, transaction?: Transaction): Promise<GameWallet> {
    const docRef = this.collection.doc(gameId);
    if (transaction) {
      const gameWalletDoc = await transaction.get(docRef);
      if (!gameWalletDoc.exists) {
        throw new NotFoundError('not found');
      }
      return gameWalletDoc.data() as GameWallet;
    } else {
      const data = await docRef.get();
      if (!data.exists) {
        throw new NotFoundError('not found');
      }
      return data.data() as GameWallet;
    }
  }

  public async consumeBalance(
    gameWallet: GameWallet,
    assetId: string,
    amount: number,
    transaction?: Transaction
  ) {
    if (transaction) {
      const docRef = this.collection.doc(gameWallet.uid);
      const updatedGameWallet = {
        ...gameWallet,
        balance: {
          ...gameWallet.balance,
          [assetId]: gameWallet.balance[assetId] - amount
        },
        updatedAt: Timestamp.now(),
      };
      transaction.update(docRef, updatedGameWallet);
    } else {
      const docRef = this.collection.doc(gameWallet.uid);
      const updatedGameWallet = {
        ...gameWallet,
        balance: {
          ...gameWallet.balance,
          [assetId]: gameWallet.balance[assetId] - amount
        },
        updatedAt: Timestamp.now(),
      };
      docRef.update(updatedGameWallet);
    }
  }
}