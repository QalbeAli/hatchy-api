import { Router } from "express";
import { updateImage } from "../../../controllers/masters/avatars/updateImage";
import { getMastersAvatar } from "../../../controllers/masters/avatars/getMastersAvatar";
import { getMastersAvatarBalance } from "../../../controllers/masters/avatars/getMastersAvatarBalance";
import { getMastersAvatarPrices } from "../../../controllers/masters/avatars/getMastersAvatarPrices";

const router = Router();

router.get("/balance/:address", getMastersAvatarBalance);
router.get("/:tokenId", getMastersAvatar);
router.get("/categories", getMastersAvatarPrices);
router.post("", updateImage);
router.get("", updateImage);

export default router;
