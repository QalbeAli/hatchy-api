"use strict";
import { Request, Response, NextFunction } from "express";
import { MastersService } from "../../../services/MastersService";

export const getTraits = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const gender = req.query.genderId;
    const color = req.query.colorId;
    const type = req.query.typeId;
    const mastersService = new MastersService();
    const traits = await mastersService.getAllTraits(
      gender ? Number(gender) : undefined,
      color ? Number(color) : undefined,
      type ? Number(type) : undefined
    );
    return traits;
  } catch (error) {
    next(error);
  }
};
