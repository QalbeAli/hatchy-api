import { TraitLayer } from './TraitLayer';

export class MastersTraitType {
  id!: number;
  name!: string;
  order!: number;
  layers: TraitLayer[];
}