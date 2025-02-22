import { NotFoundError } from "@mikro-orm/core";
import { admin } from "../../firebase/firebase";
import { Trade } from "./trade";

export class TradesService {
  tradesCollection = admin.firestore().collection('trades');

  public async getTrade(uid: string): Promise<Trade> {
    const snapshot = await this.tradesCollection.doc(uid).get();
    if (!snapshot.exists) {
      throw new NotFoundError('Not found');
    }
    return snapshot.data() as Trade;
  }

  public async getTrades(): Promise<Trade[]> {
    const snapshot = await this.tradesCollection.get();
    return snapshot.docs.map(doc => doc.data() as Trade);
  }

  public async getMyTrades(userId: string): Promise<Trade[]> {
    const snapshot = await this.tradesCollection
      .where('userId', '==', userId)
      .get();
    return snapshot.docs.map(doc => doc.data() as Trade);
  }

  public async deleteTrade(uid: string): Promise<void> {
    await this.tradesCollection.doc(uid).delete();
  }
}