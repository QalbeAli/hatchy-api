import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntityDate } from './BaseEntityDate';
import { TraitGender } from './TraitGender';
import { ItemCategory } from './ItemCategory';

@Entity()
export class Item extends BaseEntityDate {
  @Property()
  name!: string;

  @ManyToOne(() => ItemCategory, { nullable: true })
  category?: ItemCategory

  @ManyToOne(() => TraitGender, { nullable: true })
  gender?: TraitGender

  @Property({ nullable: true })
  description?: string;

  @Property()
  image!: string;

  @Property({ nullable: true })
  frontImage: string;

  @Property({ nullable: true })
  backImage: string;

  @Property({ nullable: true })
  maskImage: string;

  @Property()
  rarity?: string;

  @Property({ nullable: true })
  effects?: string;

  @Property({ nullable: true })
  storyNotes?: string;
}