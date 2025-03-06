export interface GameWallet {
  uid: string;
  active: boolean;
  balance: {
    [key: string]: number;
  }
  createdAt: string;
  updatedAt: string;
}