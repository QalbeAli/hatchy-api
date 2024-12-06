import { Timestamp } from "firebase-admin/firestore";

export interface Score {
  gameId: string;
  score: number;
  userId: string;
  username: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}