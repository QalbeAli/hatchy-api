import { Entity, Property } from '@mikro-orm/core';
import { BaseEntityDate } from './BaseEntityDate';

@Entity()
export class MastersAvatar extends BaseEntityDate {
  @Property()
  image!: string;
}