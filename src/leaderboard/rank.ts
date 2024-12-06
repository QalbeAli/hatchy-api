import { Timestamp } from "firebase-admin/firestore";

export interface Rank {
  gameId: string;
  userId: string;
  rank: number;
  username: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}