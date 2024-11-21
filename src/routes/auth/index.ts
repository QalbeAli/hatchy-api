import { Router } from "express";
import { getWalletSignMessage } from "../../controllers/auth/getWalletSignMessage";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { createUser } from "../../controllers/auth/createUser";
import { postWalletSignature } from "../../controllers/auth/postWalletSignature";

const router = Router();
router.get('/wallet', authMiddleware, getWalletSignMessage);
router.post('/wallet', authMiddleware, postWalletSignature);
router.post('/users', authMiddleware, createUser);

export default router;
