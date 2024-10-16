import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { LootboxPrice } from './LootboxPrice';
import { BaseEntity } from './BaseEntity';
import { MastersLootboxItem } from './MastersLootboxItem';

@Entity()
export class MastersLootbox extends BaseEntity {
  @Property()
  name!: string;

  @Property()
  active!: boolean;

  @Property()
  image!: string;

  @Property()
  order!: number;

  @Property()
  chainId!: number;

  @Property({ nullable: true })
  gameId: string;

  @Property()
  genderId!: number;

  @Property()
  ticketId!: number;

  @OneToMany(() => MastersLootboxItem, itemWeight => itemWeight.lootbox)
  itemWeights = new Collection<MastersLootboxItem>(this);

  @OneToMany(() => LootboxPrice, price => price.lootbox)
  prices = new Collection<LootboxPrice>(this);
}