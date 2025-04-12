export interface Wallet {
  userId: string;
  address: string;
  mainWallet?: boolean;
  privateKey?: string,
  publicKey?: string,
  seedPhrase?: string,
  isInternalWallet?: boolean,
}