import { Router } from "express";
import mastersRouter from "./masters";
import ticketsRouter from "./tickets";
import gen2Router from "./gen2";

const router = Router();
router.use('/masters', mastersRouter);
router.use('/tickets', ticketsRouter);
router.use('/gen2', gen2Router);

export default router;
