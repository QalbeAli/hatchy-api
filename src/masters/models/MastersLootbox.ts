import { LootboxPrice } from './LootboxPrice';
import { MastersLootboxItem } from './MastersLootboxItem';

export class MastersLootbox {
  id!: number;
  name!: string;
  active!: boolean;
  image!: string;
  order!: number;
  chainId!: number;
  gameId?: string;
  genderId!: number;
  ticketId!: number;
  itemWeights: MastersLootboxItem[];
  prices: LootboxPrice[];
}