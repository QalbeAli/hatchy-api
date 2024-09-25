import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';

@Entity()
export class TraitGender extends BaseEntity {
  @Property()
  name!: string;
}