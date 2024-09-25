import { Router } from "express";
import { updateImage } from "../../../controllers/masters/avatars/updateImage";
import { getMastersAvatar } from "../../../controllers/masters/avatars/getMastersAvatar";
import { getMastersAvatarBalance } from "../../../controllers/masters/avatars/getMastersAvatarBalance";
import { getMastersAvatarPrices } from "../../../controllers/masters/avatars/getMastersAvatarPrices";

const router = Router();

router.post("/image/:tokenId", updateImage);
router.get("/image-upload-url/:tokenId", updateImage);
router.get("/images/:address", updateImage);
router.get("/balance/:address", getMastersAvatarBalance);
router.get("/prices", getMastersAvatarPrices);
router.get("/:tokenId", getMastersAvatar);
router.post("", updateImage);

export default router;
