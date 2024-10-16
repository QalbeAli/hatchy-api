import { defineConfig } from "@mikro-orm/postgresql";
import { BaseEntityDate } from "./entities/BaseEntityDate";
import { Score } from "./entities/Score";
import config from "./config";
import { TraitGender } from "./entities/TraitGender";
import { TraitColor } from "./entities/TraitColor";
import { TraitType } from "./entities/TraitType";
import { TraitLayer } from "./entities/TraitLayer";
import { Trait } from "./entities/Trait";
import { Item } from "./entities/Item";
import { ItemCategory } from "./entities/ItemCategory";
import { ItemType } from "./entities/ItemType";
import { ItemLayer } from "./entities/ItemLayer";
import { MastersLootbox } from "./entities/MastersLootbox";
import { LootboxPrice } from "./entities/LootboxPrice";
import { MastersAvatar } from "./entities/MastersAvatar";
import { ApiKey } from "./entities/ApiKey";
import { Ticket } from "./entities/Ticket";
import { TicketPrice } from "./entities/TicketPrice";
import { MastersAvatarPrice } from "./entities/MastersAvatarPrice";

export default defineConfig({
  entities: [
    BaseEntityDate,
    Score,
    TraitGender,
    TraitColor,
    TraitType,
    TraitLayer,
    Trait,
    Item,
    ItemCategory,
    ItemType,
    ItemLayer,
    MastersLootbox,
    LootboxPrice,
    MastersAvatar,
    MastersAvatarPrice,
    ApiKey,
    Ticket,
    TicketPrice
  ],
  debug: false,
  dbName: config.DB_NAME,
  user: config.DB_USER,
  host: config.DB_HOST,
  password: config.DB_PASSWORD,
});