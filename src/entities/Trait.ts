import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntityDate } from './BaseEntityDate';
import { TraitGender } from './TraitGender';
import { TraitColor } from './TraitColor';
import { TraitType } from './TraitType';

@Entity()
export class Trait extends BaseEntityDate {
  @Property()
  name!: string;

  @Property()
  image!: string;

  @Property({ nullable: true })
  frontImage: string;

  @Property({ nullable: true })
  backImage: string;

  @ManyToOne(() => TraitType, { nullable: true })
  type?: TraitType

  @ManyToOne(() => TraitGender, { nullable: true })
  gender?: TraitGender

  @ManyToOne(() => TraitColor, { nullable: true })
  color?: TraitColor

  @Property()
  hide!: boolean;
}