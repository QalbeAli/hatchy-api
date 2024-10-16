import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { TicketPrice } from './TicketPrice';

@Entity()
export class Ticket extends BaseEntity {
  @Property()
  name!: string;

  @Property()
  image!: string;

  @OneToMany(() => TicketPrice, price => price.ticket)
  prices = new Collection<TicketPrice>(this);
}