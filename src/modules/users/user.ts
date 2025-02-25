export interface User {
  uid: string;
  email: string;
  referralCode: string;
  referralCount: number;
  referrerId?: string;  // ID of the user who referred this user
  displayName?: string;
  picture?: string;
  photoUrl?: string;
  disabled?: boolean;
  roles?: string[];
  bio?: string;
  xpPoints?: number;
  mainWallet?: string;
  vouchersMerged?: boolean;
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