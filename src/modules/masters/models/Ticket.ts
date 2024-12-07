import { TicketPrice } from './TicketPrice';

export class Ticket {
  id!: number;
  name!: string;
  image!: string;
  prices: TicketPrice[];
}