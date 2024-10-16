import { Entity, ManyToOne, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { Ticket } from './Ticket';

@Entity()
export class TicketPrice {
  @ManyToOne({ entity: 'Ticket', primary: true, hidden: true })
  ticket!: Ticket;

  @Property({ primary: true })
  currency!: string;

  @Property()
  decimals!: number;

  @Property()
  address!: string;
  @Property()
  image!: string;

  [PrimaryKeyProp]?: ['ticket', 'currency'];
}