"use strict";
import { Request, Response, NextFunction } from "express";
import { messageResponse } from "../../utils";
import { MastersService } from "../../services/MastersService";
import config from "../../config";
import { DefaultChainId } from "../../contracts/networks";

export const getMastersPFPImageUploadURL = async (req: Request, res: Response, next: NextFunction) => {
  const fileExtension = req.query.extension as string || "png";
  const tokenId = Number(req.params.tokenId);
  const apiKey = req.headers.authorization?.split(" ")[1];
  const chainId = Number(req.query.chainId) || DefaultChainId;
  try {
    if (apiKey !== config.IMAGE_API_KEY) {
      return messageResponse(res, 401, "Invalid Access");
    }

    const mastersService = new MastersService(chainId);
    const avatarData = await mastersService.getAvatarImageUploadURL(tokenId, fileExtension);
    return res.json({
      ...avatarData,
      tokenId,
    });
  } catch (error) {
    next(error);
  }
};
