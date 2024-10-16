"use strict";
import { Request, Response, NextFunction } from "express";

export const getTicketsMetadata = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.json({
      name: "Hatchyverse Tickets",
      // description: "Hatchyverse Tickets is a decentralized ticketing platform.",
      // image: "https://external-link-url.com/image.png",
      // banner_image: "https://external-link-url.com/banner-image.png",
      // featured_image: "https://external-link-url.com/featured-image.png",
      // external_link: "https://hatchyverse.com",
      //collaborators: ["0x0000000000000000000000000000000000000000"]
    })
  } catch (error) {
    next(error);
  }
};
