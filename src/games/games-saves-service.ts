import { NotFoundError } from "../errors/not-found-error";
import { admin } from "../firebase/firebase";
import { Timestamp } from "firebase-admin/firestore";
import { GameSave } from "./game-save";

export class GamesSavesService {

  public async createGameSave(gameId: string, userId: string, data: object, saveName: string): Promise<GameSave> {
    const docRef = admin.firestore().collection('game-saves').doc();
    const uid = docRef.id;
    const gameSave: GameSave = {
      gameId,
      userId,
      data,
      saveName,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      uid
    };
    await docRef.set(gameSave);
    return {
      ...gameSave,
      uid: docRef.id,
    };
  }
  public async updateGameSave(saveId: string, data: object): Promise<GameSave> {
    const docRef = admin.firestore().collection('game-saves').doc(saveId);
    const gameSave = await this.getGameSaveById(saveId);
    const updatedGameSave = {
      ...gameSave,
      data,
      updatedAt: Timestamp.now(),
    };
    await docRef.update(updatedGameSave);
    return updatedGameSave;
  }

  public async deleteGameSave(saveId: string): Promise<void> {
    const docRef = admin.firestore().collection('game-saves').doc(saveId);
    await docRef.delete();
  }

  public async getGameSaveById(saveId: string): Promise<GameSave> {
    const docRef = admin.firestore().collection('game-saves').doc(saveId);
    const data = (await docRef.get()).data();
    if (!data) {
      throw new NotFoundError('Game save not found');
    }
    return data as GameSave;
  }

  public async getAllUserGameSaves(userId: string): Promise<GameSave[]> {
    const querySnapshot = await admin.firestore().collection('game-saves').where('userId', '==', userId).get();
    return querySnapshot.docs.map((doc) => {
      return {
        ...doc.data(),
        uid: doc.id,
      } as GameSave;
    });
  }
}