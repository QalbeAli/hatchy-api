import { MastersItem } from './MastersItem';

export interface MastersLootboxJoepegsSignature {
  receiver: string
  tokenIds: number[]
  amounts: number[]
  items: MastersItem[]
  nonce: {
    hex: string
    type: string
  }
  signature: string
}