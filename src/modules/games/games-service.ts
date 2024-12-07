import { NotFoundError } from "../../errors/not-found-error";
import { admin } from "../../firebase/firebase";
import { Game } from "./game";

export class GamesService {

  public async getGameById(gameId: string): Promise<Game> {
    const docRef = admin.firestore().collection('games').doc(gameId);
    const data = (await docRef.get()).data();
    if (!data) {
      throw new NotFoundError('Game not found');
    }
    return data as Game;
  }

  public async getGames(): Promise<Game[]> {
    const snapshot = await admin.firestore().collection('games').get();
    return snapshot.docs.map(doc => doc.data() as Game);
  }
}