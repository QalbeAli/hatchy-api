import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { TraitType } from './TraitType';

@Entity()
export class TraitLayer extends BaseEntity {
  @Property()
  name!: string;
  @Property()
  order!: number;
  @Property()
  layer!: string;
  @ManyToOne(() => TraitType, { nullable: true })
  type: TraitType;
}