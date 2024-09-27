"use strict";
import { Request, Response, NextFunction } from "express";
import { MastersService } from "../../../services/MastersService";

export const getMastersTraitTypes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mastersService = new MastersService();
    const traitTypes = await mastersService.getTraitTypes();
    return res.json(traitTypes);
  } catch (error) {
    next(error);
  }
};
