"use strict";
import { Request, Response, NextFunction } from "express";
import { DefaultChainId } from "../../contracts/networks";
import { TicketsService } from "../../services/TicketsService";

export const getTickets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chainId = Number(req.query.chainId) || DefaultChainId;
    const ticketsService = new TicketsService(chainId);
    const tickets = await ticketsService.getTickets();
    return res.json(tickets);
  } catch (error) {
    next(error);
  }
};
