import { ItemType } from './ItemType';

export class ItemLayer {
  id!: number;
  name!: string;
  order!: number;
  layer!: string;
  type: ItemType;
}