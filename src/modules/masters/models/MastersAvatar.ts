import { MastersItem } from "./MastersItem"
import { MastersTrait } from "./MastersTrait"

export class MastersAvatar {
  tokenId: number;
  image: string;
  name: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  equippedItems: MastersItem[];
  traits: MastersTrait[];
  layers: string[];
}