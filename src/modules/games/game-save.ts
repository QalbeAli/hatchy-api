import { FieldValue, Timestamp } from "firebase-admin/firestore";

export interface GameSave {
  uid: string;
  gameId: string;
  saveName: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any
}