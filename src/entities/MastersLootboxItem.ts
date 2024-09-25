import { Entity, ManyToOne, PrimaryKeyProp, Property } from '@mikro-orm/core';
import { Item } from './Item';
import { MastersLootbox } from './MastersLootbox';

@Entity()
export class MastersLootboxItem {
  @Property()
  weight!: number;

  @ManyToOne({ entity: 'MastersLootbox', primary: true })
  lootbox!: MastersLootbox;

  @ManyToOne({ type: Item, primary: true })
  item!: Item;

  [PrimaryKeyProp]?: ['lootbox', 'item'];
}