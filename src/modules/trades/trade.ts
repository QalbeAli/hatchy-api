interface TradeAsset {
  amount: number;
  category: string;
  contract: string;
  contractType: 'ERC20' | 'ERC721' | 'ERC1155';
  image?: string;
  name: string;
  tokenId?: string;
  uid: string;
}

export interface Trade {
  requestAssets: TradeAsset[];
  offerAssets: TradeAsset[];
  usersOffers: TradeAsset[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  uid: string;
}