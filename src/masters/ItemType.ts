import { ItemLayer } from './ItemLayer';
import { ItemCategory } from './ItemCategory';

export class ItemType {
  id!: number;
  name!: string;
  layers: ItemLayer[]
  categories: ItemCategory[]
}