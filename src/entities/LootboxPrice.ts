import { Entity, ManyToOne, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { MastersLootbox } from './MastersLootbox';

@Entity()
export class LootboxPrice {
  @ManyToOne({ entity: 'MastersLootbox', primary: true })
  lootbox!: MastersLootbox;

  @Property({ primary: true })
  currency!: string;

  @Property()
  price!: string;

  @Property()
  decimals!: number;

  @Property()
  address!: string;
  @Property()
  image!: string;

  [PrimaryKeyProp]?: ['lootbox', 'currency'];
}