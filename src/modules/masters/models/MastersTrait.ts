import { TraitGender } from './TraitGender';
import { MastersColor } from './MastersColor';
import { MastersTraitType } from './MastersTraitType';

export class MastersTrait {
  id!: number;
  createdAt = new Date();
  updatedAt = new Date();
  name: string;
  image: string;
  frontImage?: string;
  backImage?: string;
  type: MastersTraitType
  gender: TraitGender
  color: MastersColor
  hide: boolean;
}