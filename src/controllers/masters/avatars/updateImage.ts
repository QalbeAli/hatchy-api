import { Request, Response, NextFunction } from "express";
import axios from "axios";
import ImageService from "../../../services/ImageService";
import config from "../../../config";

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
    const tokenId = req.params.tokenId;
    const url = `${config.HATCHY_API}/masters/avatars/image-upload-url/${tokenId}`;
    const result = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${config.API_KEY}`,
      },
    });
    const { uploadUrl, layers }: {
      uploadUrl: string;
      layers: {
        image: string,
        mask?: string
      }[]
    } = result.data;
    const b64 = await ImageService.mergeImages(layers);
    await uploadImage(b64, uploadUrl);

    res.send({
      message: "Image updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
