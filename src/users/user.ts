export interface User {
  uid: string;
  email: string;
  displayName: string;
  picture: string;
  disabled: boolean;
  bio: string;
  xpPoints: number;
  rewardReceiverAddress: string;
  wallets?: {
    address: string;
    nonce: string;
    linked: boolean;
    createdAt: number;
  }[];
}