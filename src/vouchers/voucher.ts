export interface Voucher {
  receiver?: string;
  holder: string;
  contract: string;
  contractType: string;
  type: string;
  name: string;
  amount: number;
  image?: string;
  id: string;
  tokenId?: number;
}