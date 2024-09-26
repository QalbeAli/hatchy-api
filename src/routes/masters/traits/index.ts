import { Router } from "express";
import { getMastersTraitTypes } from "../../../controllers/masters/traits/getMastersTraitTypes";
import { getTraits } from "../../../controllers/masters/traits/getTraits";

const router = Router();

router.get("/types", getMastersTraitTypes);
router.get("", getTraits);

export default router;
