import { Router } from "express";
import { getWalletAuthSignMessage } from "../../controllers/auth/getWalletAuthSignMessage";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { createUser } from "../../controllers/auth/createUser";
import { postWalletAuthSignature } from "../../controllers/auth/postWalletAuthSignature";

const router = Router();
router.get('/wallet', authMiddleware, getWalletAuthSignMessage);
router.post('/wallet', authMiddleware, postWalletAuthSignature);
router.post('/users', authMiddleware, createUser);

export default router;
