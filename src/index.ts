import { config } from "dotenv";
config();
import express, { json } from "express";
import cors from "cors";
import http from 'http';
import cron from 'node-cron';

import { errorHandler } from "./middlewares/error-handler";
import { EntityManager, EntityRepository, MikroORM, RequestContext } from "@mikro-orm/postgresql";
import { Score } from "./entities/Score";
import { TraitGender } from "./entities/TraitGender";
import { TraitType } from "./entities/TraitType";
import { TraitColor } from "./entities/TraitColor";
import { TraitLayer } from "./entities/TraitLayer";
import { Trait } from "./entities/Trait";
import { MastersLootbox } from "./entities/MastersLootbox";
import { ItemLayer } from "./entities/ItemLayer";
import { ItemCategory } from "./entities/ItemCategory";
import { ItemType } from "./entities/ItemType";
import { Item } from "./entities/Item";
import { MastersAvatar } from "./entities/MastersAvatar";
import { ApiKey } from "./entities/ApiKey";
import { Ticket } from "./entities/Ticket";
import { MastersAvatarPrice } from "./entities/MastersAvatarPrice";
import { RegisterRoutes } from "./tsoa/routes";
import swaggerDocument from "./tsoa/swagger.json";
import swaggerUI from "swagger-ui-express";
import { notFoundHandler } from "./middlewares/not-found-route-handler";
import { transformTimestampMiddleware } from "./middlewares/transform-timestamp-middleware";
import { EventsService } from "./modules/events/events-service";


export const DI = {} as {
  server: http.Server;
  orm: MikroORM,
  em: EntityManager,
  scores: EntityRepository<Score>,
  traitGenders: EntityRepository<TraitGender>,
  traitColors: EntityRepository<TraitColor>,
  traitTypes: EntityRepository<TraitType>,
  traitLayers: EntityRepository<TraitLayer>,
  traits: EntityRepository<Trait>,
  items: EntityRepository<Item>,
  itemTypes: EntityRepository<ItemType>,
  itemCategories: EntityRepository<ItemCategory>,
  itemLayers: EntityRepository<ItemLayer>,
  mastersLootboxes: EntityRepository<MastersLootbox>,
  mastersAvatars: EntityRepository<MastersAvatar>,
  mastersAvatarsPrice: EntityRepository<MastersAvatarPrice>,
  apiKeys: EntityRepository<ApiKey>,
  tickets: EntityRepository<Ticket>,
};

const app = express();
const PORT = process.env.PORT || 3000;

export const init = (async () => {
  DI.orm = await MikroORM.init();
  DI.em = DI.orm.em;
  DI.scores = DI.orm.em.getRepository(Score);
  DI.traitGenders = DI.orm.em.getRepository(TraitGender);
  DI.traitColors = DI.orm.em.getRepository(TraitColor);
  DI.traitTypes = DI.orm.em.getRepository(TraitType);
  DI.traits = DI.orm.em.getRepository(Trait);
  DI.items = DI.orm.em.getRepository(Item);
  DI.itemTypes = DI.orm.em.getRepository(ItemType);
  DI.itemCategories = DI.orm.em.getRepository(ItemCategory);
  DI.itemLayers = DI.orm.em.getRepository(ItemLayer);
  DI.mastersLootboxes = DI.orm.em.getRepository(MastersLootbox);
  DI.mastersAvatars = DI.orm.em.getRepository(MastersAvatar);
  DI.mastersAvatarsPrice = DI.orm.em.getRepository(MastersAvatarPrice);
  DI.apiKeys = DI.orm.em.getRepository(ApiKey);
  DI.tickets = DI.orm.em.getRepository(Ticket);

  app.use(json());
  app.use(cors());
  app.use((req, res, next) => RequestContext.create(DI.orm.em, next));
  app.use(transformTimestampMiddleware);
  RegisterRoutes(app);
  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
  app.use(notFoundHandler);
  app.use(errorHandler);

  const eventsService = new EventsService();
  // cron.schedule("*/1 * * * *", () => {
  cron.schedule("0 0 * * *", () => {
    eventsService.giveEventRewards();
  });

  DI.server = app.listen(PORT, () => {
    console.log(`Server Listening on PORT: ${PORT} http://localhost:${PORT}`);
  });
})();
