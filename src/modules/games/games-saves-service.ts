import { NotFoundError } from "../../errors/not-found-error";
import { admin } from "../../firebase/firebase";
import { Timestamp, Transaction } from "firebase-admin/firestore";
import { GameSave } from "./game-save";

export class GamesSavesService {

  collection = admin.firestore().collection('game-saves');
  public async createGameSave(gameId: string, userId: string, data: {
    [key: string]: any
  }, saveName: string): Promise<GameSave> {
    const docRef = admin.firestore().collection('game-saves').doc();
    const uid = docRef.id;
    const gameSave = {
      gameId,
      userId,
      data,
      saveName,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      uid
    };
    await docRef.set(gameSave);

    const createdDoc = await docRef.get();
    return {
      ...createdDoc.data()
    } as GameSave;
  }

  public async updateGameSave(saveId: string, data: {
    [key: string]: any
  },): Promise<GameSave> {
    const docRef = admin.firestore().collection('game-saves').doc(saveId);
    const gameSave = await this.getGameSaveById(saveId);
    const updatedGameSave = {
      ...gameSave,
      data,
      updatedAt: Timestamp.now(),
    };
    await docRef.update(updatedGameSave);

    const updatedDoc = await docRef.get();
    return updatedDoc.data() as GameSave;
  }

  public async deleteGameSave(saveId: string): Promise<void> {
    const docRef = admin.firestore().collection('game-saves').doc(saveId);
    await docRef.delete();
  }

  public async getGameSaveById(saveId: string, transaction?: Transaction): Promise<GameSave> {
    const docRef = admin.firestore().collection('game-saves').doc(saveId);
    if (transaction) {
      const doc = await transaction.get(docRef);
      if (!doc.exists) {
        throw new NotFoundError('Game save not found');
      }
      return doc.data() as GameSave;
    } else {
      const doc = await docRef.get();
      if (!doc.exists) {
        throw new NotFoundError('Game save not found');
      }
      return doc.data() as GameSave;
    }
  }

  public async getAllUserGameSaves(userId: string, gameId?: string): Promise<GameSave[]> {
    let querySnapshot;
    if (gameId) {
      querySnapshot = await admin.firestore().collection('game-saves')
        .where('userId', '==', userId)
        .where('gameId', '==', gameId)
        .get();
    } else {
      querySnapshot = await admin.firestore().collection('game-saves')
        .where('userId', '==', userId)
        .get();
    }
    return querySnapshot.docs.map((doc) => {
      return {
        ...doc.data(),
        uid: doc.id,
      } as GameSave;
    });
  }

  public async consumeCurrency(
    saveId: string,
    currency: string,
    amount: number
  ) {
    return admin.firestore().runTransaction(async (transaction) => {
      const docRef = this.collection.doc(saveId);
      const gameSave = await this.getGameSaveById(saveId, transaction);
      const updatedGameSave = {
        ...gameSave,
        data: {
          ...gameSave.data,
          [currency]: gameSave.data[currency] - amount
        },
        updatedAt: Timestamp.now(),
      };
      await transaction.update(docRef, updatedGameSave);
    });
  }
}