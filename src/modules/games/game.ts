import { Timestamp } from "firebase-admin/firestore";
export interface Game {
  uid: string;
  name: string;
  description: string;
  itchioEmbedLink?: string;
  itchioLink?: string;
  status?: string;
  requirement?: string;
  views?: number;
  slug?: string;
  deeplink?: string;
  previewImage?: string;
  images?: Array<string>;
  downloadLink?: string;
  androidLink?: string;
  iosLink?: string;
}