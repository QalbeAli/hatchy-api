import { Router } from "express";
import mastersRouter from "./masters";

const router = Router();
router.use('/masters', mastersRouter);

export default router;
