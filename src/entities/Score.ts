import { Entity, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Score {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @Property({ type: 'timestamp with time zone' })
  createdAt = new Date();

  @Property({ type: 'timestamp with time zone', onUpdate: () => new Date() })
  updatedAt = new Date();

  @PrimaryKey()
  name!: string;

  @Property()
  score!: number;
}