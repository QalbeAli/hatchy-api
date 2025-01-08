export interface User {
  uid: string;
  email: string;
  referralCode: string;
  referralCount: number;
  referrerId?: string;  // ID of the user who referred this user
  displayName?: string;
  picture?: string;
  disabled?: boolean;
  roles?: string[];
  bio?: string;
  xpPoints?: number;
  mainWallet?: string;
  discordConfirmed?: boolean;
  discordId?: string;
  discordUsername?: string;
  wallets?: {
    address: string;
    nonce: string;
    linked: boolean;
    createdAt: number;
  }[];
}