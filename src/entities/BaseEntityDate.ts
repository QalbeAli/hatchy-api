import { OptionalProps, Property } from '@mikro-orm/postgresql';
import { BaseEntity } from './BaseEntity';

export abstract class BaseEntityDate extends BaseEntity {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @Property({ type: 'timestamp with time zone' })
  createdAt = new Date();

  @Property({ type: 'timestamp with time zone', onUpdate: () => new Date() })
  updatedAt = new Date();

}
