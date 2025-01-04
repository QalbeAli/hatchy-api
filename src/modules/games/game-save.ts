import { FieldValue, Timestamp } from "firebase-admin/firestore";

export interface GameSave {
  uid: string;
  gameId: string;
  saveName: string;
  userId: string;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
  [key: string]: any
}