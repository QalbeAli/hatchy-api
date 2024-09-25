import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { ItemType } from './ItemType';

@Entity()
export class ItemCategory extends BaseEntity {
  @Property()
  name!: string;

  @ManyToOne(() => ItemType, { nullable: true })
  type: ItemType;
}