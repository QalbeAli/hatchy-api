import { Entity, PrimaryKeyProp, Property } from '@mikro-orm/core';

@Entity()
export class MastersAvatarPrice {
  @Property({ primary: true })
  chainId!: number;

  @Property({ primary: true })
  currency!: string;

  @Property()
  price!: string;

  @Property()
  decimals!: number;

  @Property()
  address!: string;

  @Property()
  image!: string;

  [PrimaryKeyProp]?: ['chainId', 'currency'];
}