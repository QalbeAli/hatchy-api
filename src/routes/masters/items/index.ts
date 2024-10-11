import { Router } from "express";
import { getMastersItemsBalance } from "../../../controllers/masters/items/getMastersItemsBalance";
import { getMastersItems } from "../../../controllers/masters/items/getMastersItems";
import { getMastersItem } from "../../../controllers/masters/items/getMastersItem";
import { getMastersItemCategories } from "../../../controllers/masters/items/getMastersItemCategories";
import { mintMastersItem } from "../../../controllers/masters/items/mintMastersItem";

const router = Router();

router.post("/mint", mintMastersItem);
router.get("/categories", getMastersItemCategories);
router.get("/balance/:address", getMastersItemsBalance);
router.get("/:tokenId", getMastersItem);
router.get("", getMastersItems);

export default router;
