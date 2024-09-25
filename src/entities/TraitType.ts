import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';
import { TraitLayer } from './TraitLayer';

@Entity()
export class TraitType extends BaseEntity {
  @Property()
  name!: string;
  @Property()
  order!: number;
  @OneToMany(() => TraitLayer, layer => layer.type)
  layers = new Collection<TraitLayer>(this);
}