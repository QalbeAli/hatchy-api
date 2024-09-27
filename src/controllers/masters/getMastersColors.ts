"use strict";
import { Request, Response, NextFunction } from "express";
import { MastersService } from "../../services/MastersService";

export const getMastersColors = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const typeId = req.query.typeId;
    const mastersService = new MastersService();
    const colors = await mastersService.getColors(Number(typeId));
    return res.json(colors);
  } catch (error) {
    next(error);
  }
};
