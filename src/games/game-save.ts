import { Timestamp } from "firebase-admin/firestore";

export interface GameSave {
  uid: string;
  data: {
    [key: string]: any
  };
  gameId: string;
  saveName: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}