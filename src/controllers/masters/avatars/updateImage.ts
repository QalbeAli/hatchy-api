import { Request, Response, NextFunction } from "express";
import axios from "axios";
import ImageService from "../../../services/ImageService";
import { DefaultChainId } from "../../../contracts/networks";
import { MastersService } from "../../../services/MastersService";

const uploadImage = async (buffer: Buffer, uploadUrl: string) => {
  await axios.put(uploadUrl, buffer, {
    headers: {
      "Content-Type": "image/png",
      "Content-Encoding": "base64",
    },
  });
  console.log("Image uploaded successfully ");
};

export const updateImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const chainId = Number(req.query.chainId) || DefaultChainId;

    const fileExtension = (req.query.extension || "png") as string;
    const tokenId = Number(req.params.tokenId);
    const mastersService = new MastersService(chainId);
    const avatarData = await mastersService.getAvatarImageUploadURL(tokenId, fileExtension);
    const { uploadUrl, layers } = avatarData;

    const b64 = await ImageService.mergeImages(layers);
    await uploadImage(b64, uploadUrl);

    res.send({
      message: "Image updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
