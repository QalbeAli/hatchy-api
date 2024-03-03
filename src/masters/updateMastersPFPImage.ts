import mergeImages from "merge-images";
import { Canvas, Image } from "canvas";
import { Request, Response } from "express";
import axios from "axios";

export const handler = async (request: Request, response: Response) => {
  return endpointHandler(request, response, process.env.API_URL);
};

export const devHandler = async (request: Request, response: Response) => {
  return endpointHandler(request, response, process.env.API_URL_DEV);
};

const endpointHandler = async (request: Request, response: Response, apiURL?: string) => {
  const tokenId = request.params.tokenId;

  const url = `${apiURL}/masters/pfp/image-upload-url/${tokenId}`;
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

    const b64 = await joinImages(
      traits
        .map((trait) => trait.image)
        .filter((image) => !!image)
        .concat(items.filter((image) => !!image).map((item) => item.image))
    );
    await uploadImage(b64, uploadUrl);

    response.send({
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.log(error);
    response.send({
      message: "Image upload failed",
    });
  }
};

const joinImages = async (images: string[]) => {
  console.log(images);
  const b64 = await mergeImages(images, {
    Canvas: Canvas,
    Image: Image,
  });
  return b64;
};

const uploadImage = async (base64Image: string, uploadUrl: string) => {
  const buffer = Buffer.from(
    base64Image.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  await axios.put(uploadUrl, buffer, {
    headers: {
      "Content-Type": "image/png",
      "Content-Encoding": "base64",
    },
  });
  console.log("Image uploaded successfully ");
};
