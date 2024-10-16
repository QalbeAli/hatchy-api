"use strict";
import { Request, Response, NextFunction } from "express";
import { DefaultChainId } from "../../contracts/networks";
import { TicketsService } from "../../services/TicketsService";
import { messageResponse } from "../../utils";

export const getTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chainId = Number(req.query.chainId) || DefaultChainId;
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return messageResponse(res, 400, "Invalid id");
    }
    const ticketsService = new TicketsService(chainId);
    const ticket = await ticketsService.getTicket(Number(id));
    return res.json(ticket);
  } catch (error) {
    next(error);
  }
};
