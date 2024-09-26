import { Router } from "express";
import { updateImage } from "../../../controllers/masters/avatars/updateImage";
import { getMastersAvatar } from "../../../controllers/masters/avatars/getMastersAvatar";
import { getMastersAvatarBalance } from "../../../controllers/masters/avatars/getMastersAvatarBalance";
import { getMastersAvatarPrices } from "../../../controllers/masters/avatars/getMastersAvatarPrices";
import { getMastersAvatarImage } from "../../../controllers/masters/avatars/getMastersAvatarImages";
import { getMastersPFPImageUploadURL } from "../../../controllers/masters/getMastersPFPImageUploadUrl";
import { getMastersPFPSignature } from "../../../controllers/masters/getMastersPFPSignature";

const router = Router();

router.post("/image/:tokenId", updateImage); // change to /images
router.get("/image-upload-url/:tokenId", getMastersPFPImageUploadURL);
router.get("/images/:address", getMastersAvatarImage);
router.get("/balance/:address", getMastersAvatarBalance);
router.get("/prices", getMastersAvatarPrices);
router.get("/:tokenId", getMastersAvatar);
router.post("", getMastersPFPSignature);

export default router;
