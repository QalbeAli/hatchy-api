import { Router } from "express";
import mastersRouter from "./masters";
import ticketsRouter from "./tickets";
import gen2Router from "./gen2";
import authRouter from "./auth";
import linkRouter from "./link";
import usersRouter from "./users";

const router = Router();
router.use('/masters', mastersRouter);
router.use('/tickets', ticketsRouter);
router.use('/gen2', gen2Router);
router.use('/auth', authRouter);
router.use('/link', linkRouter);
router.use('/users', usersRouter);

export default router;
