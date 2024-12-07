import { MastersTraitType } from './MastersTraitType';

export class TraitLayer {
  id!: number;
  name!: string;
  order!: number;
  layer!: string;
  type?: MastersTraitType;
}