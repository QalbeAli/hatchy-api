import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth-middleware";
import { getUserInfo } from "../../controllers/users/getUserInfo";

const router = Router();
router.get('', authMiddleware, getUserInfo);

export default router;
