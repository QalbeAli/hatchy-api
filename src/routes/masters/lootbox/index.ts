import { Router } from "express";
import { getMastersLootboxes } from "../../../controllers/masters/lootbox/getMastersLootboxes";
import { getMastersLootboxSignature } from "../../../controllers/masters/lootbox/getMastersLootboxSignature";

const router = Router();

router.post("", getMastersLootboxSignature);
router.get("", getMastersLootboxes);

export default router;