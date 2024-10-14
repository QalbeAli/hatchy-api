import { Entity, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class ApiKey {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @PrimaryKey()
  id!: string;

  @Property({ type: 'timestamp with time zone' })
  createdAt = new Date();

  @Property({ type: 'timestamp with time zone', onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property()
  apiKey!: string;

  @Property()
  name!: string;

  @Property()
  service!: string;

  @Property()
  eggsLimit!: number;

  @Property()
  tokenLimit!: number;

  @Property()
  mastersItemsLimit!: number;
}