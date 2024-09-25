import { Router } from "express";
import { updateImage } from "../../../controllers/masters/avatars/updateImage";
import { getMastersAvatarBalance } from "../../../controllers/masters/avatars/getMastersAvatarBalance";

const router = Router();

router.get("/types", getMastersAvatarBalance);
router.post("/image-upload-url", updateImage);
router.get("", updateImage);
router.post("", updateImage);

export default router;
