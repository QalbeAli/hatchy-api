import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { ItemLayer } from './ItemLayer';
import { ItemCategory } from './ItemCategory';

@Entity()
export class ItemType extends BaseEntity {
  @Property()
  name!: string;

  @OneToMany(() => ItemLayer, layer => layer.type)
  layers = new Collection<ItemLayer>(this);

  @OneToMany(() => ItemCategory, category => category.type)
  categories = new Collection<ItemCategory>(this);
}