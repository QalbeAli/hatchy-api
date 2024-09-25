import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { ItemType } from './ItemType';

@Entity()
export class ItemLayer extends BaseEntity {
  @Property()
  name!: string;
  @Property()
  order!: number;
  @Property()
  layer!: string;
  @ManyToOne(() => ItemType, { nullable: true })
  type: ItemType;
}