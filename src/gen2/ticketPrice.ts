import { Ticket } from "./ticket";

export interface TicketPrice {
  ticket: Ticket;
  currency: string;
  decimals: number;
  address: string;
  image: string;
}