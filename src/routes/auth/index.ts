import { Router } from "express";
import { getWalletSignMessage } from "../../controllers/auth/getWalletSignMessage";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { createUser } from "../../controllers/auth/createUser";

const router = Router();
router.get('/wallet', authMiddleware, getWalletSignMessage);
router.post('/users', authMiddleware, createUser);

export default router;
