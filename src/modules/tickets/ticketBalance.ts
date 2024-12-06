import { TicketPrice } from "./ticketPrice";

export interface TicketBalance {
  id: number;
  name: string;
  image: string;
  price: TicketPrice[];
  balance: number;
}