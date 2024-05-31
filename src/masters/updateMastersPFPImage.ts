import { Request, Response } from "express";
import axios from "axios";
import ImageService from "../services/ImageService";

export const handler = async (request: Request, response: Response) => {
  return endpointHandler(request, response, process.env.API_URL);
};

export const devHandler = async (request: Request, response: Response) => {
  return endpointHandler(request, response, process.env.API_URL_DEV);
};

const endpointHandler = async (request: Request, response: Response, apiURL?: string) => {
  const tokenId = request.params.tokenId;

  const url = `${apiURL}/masters/avatars/image-upload-url/${tokenId}`;
  try {
    const result = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });
    const { uploadUrl, traits, items }: {
      uploadUrl: string;
      traits: { image: string }[];
      items: { image: string }[];
    } = result.data;

    const b64 = await ImageService.mergeImages(
      traits
        .map((trait) => trait.image)
        .filter((image) => !!image)
        .concat(items.filter((image) => !!image).map((item) => item.image))
    );
    await uploadImage(b64, uploadUrl);

    response.send({
      message: "Image uploaded successfully",
    });
  } catch (error: any) {
    console.log(error.data.message);
    response.send({
      message: "Image upload failed",
    });
  }
};

const uploadImage = async (buffer: Buffer, uploadUrl: string) => {
  await axios.put(uploadUrl, buffer, {
    headers: {
      "Content-Type": "image/png",
      "Content-Encoding": "base64",
    },
  });
  console.log("Image uploaded successfully ");
};
