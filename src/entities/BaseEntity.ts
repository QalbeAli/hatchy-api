import { PrimaryKey } from '@mikro-orm/postgresql';

export abstract class BaseEntity {
  @PrimaryKey()
  id!: number;
}
