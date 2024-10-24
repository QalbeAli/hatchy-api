import { Router } from "express";
import { getMastersLootboxes } from "../../../controllers/masters/lootbox/getMastersLootboxes";
import { getMastersLootboxSignature } from "../../../controllers/masters/lootbox/getMastersLootboxSignature";
import { buyLootbox } from "../../../controllers/masters/lootbox/buyLootbox";
import { getMastersLootboxJPSignature } from "../../../controllers/masters/lootbox/getMastersLootboxJPSignature";

const router = Router();

router.post("/buy", buyLootbox);
router.post("/joepegs", getMastersLootboxJPSignature);
router.post("", getMastersLootboxSignature);
router.get("", getMastersLootboxes);

export default router;