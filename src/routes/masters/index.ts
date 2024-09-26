import { Router } from "express";
import avatarsRouter from "./avatars";
import itemsRouter from "./items";
import traitsRouter from "./traits";
import lootboxRouter from "./lootbox";
import { getMastersColors } from "../../controllers/masters/getMastersColors";
import { getMastersGenders } from "../../controllers/masters/getMastersGenders";
import { getMastersEquipSignature } from "../../controllers/masters/getMastersEquipSignature";
import { getMintTraits } from "../../controllers/masters/traits/getMintTraits";

const router = Router();
router.use('/avatars', avatarsRouter);
router.use('/items', itemsRouter);
router.use('/traits', traitsRouter);
router.use('/lootbox', lootboxRouter);
router.get('/colors', getMastersColors);
router.get('/genders', getMastersGenders);
router.post('/equip/signature', getMastersEquipSignature);
router.post('/mint/traits', getMintTraits);

export default router;
