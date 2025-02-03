import { LootboxPrice } from './LootboxPrice';
import { MastersLootboxItem } from './MastersLootboxItem';

export class MastersLootbox {
  id: number;
  name: string;
  active: boolean;
  image: string;
  order: number;
  chainId: number | null;
  gameId: string | null;
  genderId: number;
  ticketId: number | null;
  itemWeights: MastersLootboxItem[];
  prices: LootboxPrice[];
}