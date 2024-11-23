import { ItemCategory } from './ItemCategory';
import { TraitGender } from './TraitGender';

export class Item {
  createdAt = new Date();
  updatedAt = new Date();
  name!: string;
  category?: ItemCategory
  gender?: TraitGender
  description?: string;
  image!: string;
  frontImage?: string;
  backImage?: string;
  maskImage?: string;
  rarity?: string;
  effects?: string;
  storyNotes?: string;
}