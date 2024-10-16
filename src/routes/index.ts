import { Router } from "express";
import mastersRouter from "./masters";
import ticketsRouter from "./tickets";

const router = Router();
router.use('/masters', mastersRouter);
router.use('/tickets', ticketsRouter);

export default router;
