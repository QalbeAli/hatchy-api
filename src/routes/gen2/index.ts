import { Router } from "express";
import { getGen2SaleSignature } from "../../controllers/gen2/getGen2SaleSignature";
import { getGen2SalePrice } from "../../controllers/gen2/getGen2SalePrice";

const router = Router();
router.post('/sale-signature', getGen2SaleSignature);
router.get('/price', getGen2SalePrice);

export default router;
