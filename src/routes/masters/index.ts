import { Router } from "express";
import avatarsRouter from "./avatars";
import itemsRouter from "./items";
import traitsRouter from "./traits";
import lootboxRouter from "./lootbox";
import { updateImage } from "../../controllers/masters/avatars/updateImage";

const router = Router();
router.use('/avatars', avatarsRouter);
router.use('/items', itemsRouter);
router.use('/traits', traitsRouter);
router.use('/lootbox', lootboxRouter);
router.get('/colors', updateImage);
router.get('/genders', updateImage);
router.post('/equip/signature', updateImage);
router.post('/mint/traits', updateImage);

export default router;
