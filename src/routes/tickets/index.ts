import { Router } from "express";
import { getTickets } from "../../controllers/tickets/getTickets";
import { getTicket } from "../../controllers/tickets/getTicket";
import { getTicketsBalance } from "../../controllers/tickets/getTicketsBalance";
import { getTicketsMetadata } from "../../controllers/tickets/getTicketsMetadata";

const router = Router();
router.get('/metadata', getTicketsMetadata);
router.get('/balance/:address', getTicketsBalance);
router.get('/', getTickets);
router.get('/:id', getTicket);

export default router;
