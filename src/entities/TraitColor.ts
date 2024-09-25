import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';

@Entity()
export class TraitColor extends BaseEntity {
  @Property()
  color!: string;

  @Property()
  typeId!: number;

  @Property()
  name!: string;
}