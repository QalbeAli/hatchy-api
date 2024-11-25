import { MastersItem } from './MastersItem';

export interface MastersLootboxSignature {
  receiver: string
  tokenIds: number[]
  amounts: number[]
  items: MastersItem[]
  nonce: {
    hex: string
    type: string
  }
  claimableUntil: number
  currency: string
  price: string
  decimals: number
  payWithTicket: boolean
  ticketId: number
  signature: string
}