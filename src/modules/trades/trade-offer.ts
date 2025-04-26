import { TradeAsset } from "./trade";

export interface TradeOffer {
  tradeId: string,
  userId: string;
  offer: TradeAsset[];
  tradeAssets: TradeAsset[],
  tradeStatus: string,
}