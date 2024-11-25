import { TicketPrice } from "./ticketPrice";

export interface Ticket {
  id: number;
  name: string;
  image: string;
  price?: TicketPrice[];
}