import { Router } from "express";
import { updateImage } from "../../../controllers/masters/avatars/updateImage";
import { getMastersAvatarBalance } from "../../../controllers/masters/avatars/getMastersAvatarBalance";

const router = Router();

router.post("", updateImage);
router.get("", updateImage);

router.get("/types", getMastersAvatarBalance);
router.post("/image-upload-url", updateImage);

export default router;