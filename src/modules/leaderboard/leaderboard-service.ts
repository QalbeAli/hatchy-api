import { admin } from "../../firebase/firebase";
import { Timestamp } from "firebase-admin/firestore";
import { Game } from "../games/game";
import { User } from "../users/user";
import { Score } from "./score";
import { Rank } from "./rank";

export class LeaderboardService {
  public async addScore(game: Game, user: User, score: number): Promise<Score> {
    const scoresRef = admin.firestore().collection('scores');
    const querySnapshot = await scoresRef
      .where('gameId', '==', game.uid)
      .where('userId', '==', user.uid)
      .limit(1)
      .get();

    if (!querySnapshot.empty) {
      const existingScoreDoc = querySnapshot.docs[0];
      const existingScore = existingScoreDoc.data().score;
      const scoreData = existingScoreDoc.data();
      const now = Timestamp.now();
      if (score > existingScore) {
        await existingScoreDoc.ref.update({
          score: score,
          updatedAt: now,
        });
      }
      return {
        gameId: scoreData.gameId,
        userId: scoreData.userId,
        username: scoreData.username,
        score: score > existingScore ? score : existingScore,
        createdAt: scoreData.createdAt,
        updatedAt: score > existingScore ? now : scoreData.updatedAt,
      };

    } else {
      const newScoreRef = scoresRef.doc();
      const scoreData = {
        gameId: game.uid,
        userId: user.uid,
        username: user.displayName,
        score,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }
      await newScoreRef.set(scoreData);
      return scoreData;
    }
  }

  public async getScoreLeaderboard(gameId: string, limit?: number): Promise<Score[]> {
    const querySnapshot = await admin.firestore().collection('scores')
      .where('gameId', '==', gameId)
      .orderBy('score', 'desc')
      .limit(limit || 10)
      .get();
    return querySnapshot.docs.map((doc) => ({
      userId: doc.data().userId,
      gameId: doc.data().gameId,
      username: doc.data().username,
      createdAt: doc.data().createdAt,
      updatedAt: doc.data().updatedAt,
      score: doc.data().score,
    }));
  }

  public async getUserScore(gameId: string, userId: string): Promise<Score> {
    const querySnapshot = await admin.firestore().collection('scores')
      .where('gameId', '==', gameId)
      .where('userId', '==', userId)
      .limit(1)
      .get();
    if (querySnapshot.empty) {
      return null;
    }
    const doc = querySnapshot.docs[0];
    return {
      userId: doc.data().userId,
      gameId: doc.data().gameId,
      username: doc.data().username,
      createdAt: doc.data().createdAt,
      updatedAt: doc.data().updatedAt,
      score: doc.data().score,
    };
  }

  public async updateRank(game: Game, user: User, rank: number): Promise<Rank> {
    const docRef = admin.firestore().collection('ranks');
    const querySnapshot = await docRef
      .where('gameId', '==', game.uid)
      .where('userId', '==', user.uid)
      .limit(1)
      .get();

    if (!querySnapshot.empty) {
      const existingRankDoc = querySnapshot.docs[0];
      const rankData = existingRankDoc.data();
      const now = Timestamp.now();
      await existingRankDoc.ref.update({
        rank,
        updatedAt: now,
      });
      return {
        gameId: rankData.gameId,
        userId: rankData.userId,
        username: rankData.username,
        rank,
        createdAt: rankData.createdAt,
        updatedAt: now,
      };

    } else {
      const userRank = {
        gameId: game.uid,
        userId: user.uid,
        rank,
        username: user.displayName,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      await docRef.doc().set(userRank);
      return userRank;
    }
  }

  public async getRankLeaderboard(gameId: string, limit?: number): Promise<Rank[]> {
    const querySnapshot = await admin.firestore().collection('ranks')
      .where('gameId', '==', gameId)
      .orderBy('rank', 'desc')
      .limit(limit || 10)
      .get();
    return querySnapshot.docs.map((doc) => ({
      gameId: doc.data().gameId,
      userId: doc.data().userId,
      rank: doc.data().rank,
      username: doc.data().username,
      createdAt: doc.data().createdAt,
      updatedAt: doc.data().updatedAt,
    }));
  }

  public async getUserRank(gameId: string, userId: string): Promise<Rank> {
    const querySnapshot = await admin.firestore().collection('ranks')
      .where('gameId', '==', gameId)
      .where('userId', '==', userId)
      .limit(1)
      .get();
    if (querySnapshot.empty) {
      return null;
    }
    const doc = querySnapshot.docs[0];
    return {
      userId: doc.data().userId,
      gameId: doc.data().gameId,
      username: doc.data().username,
      createdAt: doc.data().createdAt,
      updatedAt: doc.data().updatedAt,
      rank: doc.data().rank,
    };
  }
}