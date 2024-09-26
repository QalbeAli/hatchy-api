import { Router } from "express";
import { updateImage } from "../../../controllers/masters/avatars/updateImage";
import { getMastersItemsBalance } from "../../../controllers/masters/items/getMastersItemsBalance";
import { getMastersItems } from "../../../controllers/masters/items/getMastersItems";
import { getMastersItem } from "../../../controllers/masters/items/getMastersItem";
import { getMastersItemCategories } from "../../../controllers/masters/items/getMastersItemCategories";

const router = Router();

router.get("/balance/:address", getMastersItemsBalance);
router.get("/:tokenId", getMastersItem);
router.get("/categories", getMastersItemCategories);
router.get("", getMastersItems);

export default router;
