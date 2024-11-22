import { Router } from "express";
import { getWalletSignMessage } from "../../controllers/link/getWalletSignMessage";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { postWalletSignature } from "../../controllers/link/postWalletSignature";

const router = Router();
router.get('/wallet', authMiddleware, getWalletSignMessage);
router.post('/wallet', authMiddleware, postWalletSignature);

export default router;
