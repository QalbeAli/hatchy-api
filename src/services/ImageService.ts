import axios from "axios";
import sharp from "sharp";

const mergeImages = async (
  layers: {
    image: string,
    mask?: string
  }[]
) => {
  const imageUrls = layers.map((layer) => {
    return layer.image;
  });

  const images = await Promise.all(imageUrls.map(downloadImage))
  const buffer = await sharp(images[0])
    .composite(images.slice(1).map(input =>
      ({ input }))
    )
    .toBuffer();
  return buffer
}

const downloadImage = async (url: string) => {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });
  return response.data as Buffer;
};

export default {
  mergeImages
}