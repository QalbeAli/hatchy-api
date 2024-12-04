import { Router } from "express";
import { getWalletAuthSignMessage } from "../../controllers/auth/getWalletAuthSignMessage";
import { authMiddleware } from "../../middlewares/auth-middleware";
import { createUser } from "../../controllers/auth/createUser";
import { postWalletAuthSignature } from "../../controllers/auth/postWalletAuthSignature";

const router = Router();
router.get('/wallet', getWalletAuthSignMessage);
router.post('/wallet', postWalletAuthSignature);
router.post('/users', authMiddleware, createUser);

export default router;
