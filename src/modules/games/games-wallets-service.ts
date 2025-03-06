import { NotFoundError } from "../../errors/not-found-error";
import { admin } from "../../firebase/firebase";
import { Timestamp } from "firebase-admin/firestore";
import { GameWallet } from "./game-wallet";

export class GamesWalletsService {
  collection = admin.firestore().collection('game-wallets');
  public async getGameWalletById(gameId: string): Promise<GameWallet> {
    const docRef = this.collection.doc(gameId);
    const data = (await docRef.get()).data();
    if (!data) {
      throw new NotFoundError('not found');
    }
    return data as GameWallet;
  }

  public async consumeBalance(
    gameId: string,
    assetId: string,
    amount: number
  ) {
    const docRef = this.collection.doc(gameId);
    const gameWallet = await this.getGameWalletById(gameId);
    const updatedGameWallet = {
      ...gameWallet,
      balance: {
        ...gameWallet.balance,
        [assetId]: gameWallet.balance[assetId] - amount
      },
      updatedAt: Timestamp.now(),
    };
    await docRef.update(updatedGameWallet);
  }
}