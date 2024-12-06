export interface Game {
  uid: string;
  status: string;
  requirement: string;
  views: number;
  name: string;
  slug: string;
  deeplink?: string;
  description: string;
  previewImage?: string;
  images?: Array<string>;
  downloadLink?: string;
  androidLink?: string;
  iosLink?: string;
  createdAt: number;
}