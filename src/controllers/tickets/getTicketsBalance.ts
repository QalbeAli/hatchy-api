"use strict";
import { isAddress } from "ethers/lib/utils";
import { Request, Response, NextFunction } from "express";
import { messageResponse } from "../../utils";
import { TicketsService } from "../../services/TicketsService";
import { DefaultChainId } from "../../contracts/networks";

export const getTicketsBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chainId = Number(req.query.chainId) || DefaultChainId;
    const address = req.params.address;
    if (!isAddress(address)) return messageResponse(res, 400, 'Invalid address');
    const ticketsService = new TicketsService(chainId);
    const tickets = await ticketsService.getTicketsBalance(address);
    return res.json(tickets);
  } catch (error) {
    next(error);
  }
};
