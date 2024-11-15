'use strict'
import { Request, Response, NextFunction } from "express";
import { CoingeckoService } from "../../services/CoingeckoService";

const usdtPrice = '3';
const discountMultiplier = 0.8;
export const getGen2SalePrice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const coingeckoService = new CoingeckoService();
    const livePrice = await coingeckoService.getHatchyPrice();
    const hatchyPriceUsdt = parseFloat(usdtPrice) / livePrice;
    const hatchyPriceDiscounted = hatchyPriceUsdt * discountMultiplier;
    const hatchyPrice = hatchyPriceDiscounted.toFixed(0);
    return res.json({
      price: Number(hatchyPrice)
    });
  } catch (error) {
    next(error);
  }
}