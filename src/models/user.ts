export interface User {
  address: string;
  username?: string;
  xpPoints?: number;
  airdropPoints?: number;
  bio?: string;
  profilePicture?: string;
  type: 'new' | 'old';
  lastBadgesUpdate?: number;
  verificationCode?: number;
  emailLoginCode?: number;
  discordConfirmed?: boolean;
  discordId?: number;
  discordPin?: number;
  discordUsername?: string;
  walletMessage?: string;
  linkedWallets?: Array<{
    username: string;
    linked: boolean;
  }>;
  rewardReceiverAddress: string;
  linkedGoogle?: Array<{
    username: string;
    email: string;
    linked: boolean;
  }>;
}