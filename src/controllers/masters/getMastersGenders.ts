"use strict";
import { Request, Response, NextFunction } from "express";
import { MastersService } from "../../services/MastersService";

export const getMastersGenders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mastersService = new MastersService();
    const genders = await mastersService.getGenders();
    return res.json(genders);
  } catch (error) {
    next(error);
  }
};
