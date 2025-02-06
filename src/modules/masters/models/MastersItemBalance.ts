import { ItemCategory } from './ItemCategory';
import { TraitGender } from './TraitGender';

export class MastersItemBalance {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  category: ItemCategory
  gender?: TraitGender | null;
  description?: string | null;
  image: string;
  frontImage?: string | null;
  backImage?: string | null;
  maskImage?: string | null;
  rarity?: string | null;
  effects?: string | null;
  storyNotes?: string | null;
  balance: number;
}