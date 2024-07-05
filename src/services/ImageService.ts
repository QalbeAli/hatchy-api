import axios from "axios";
import sharp from "sharp";

interface Layer {
  image: string;
  mask?: string;
}
const mergeImages = async (
  layers: Layer[]
) => {
  // Download all images and masks concurrently
  const downloads = layers.flatMap(layer => [
    downloadImage(layer.image),
    layer.mask ? downloadImage(layer.mask) : Promise.resolve(undefined)
  ]);
  const downloadedImages = await Promise.all(downloads);

  // Process each layer, apply mask if exists
  const processedImages = await Promise.all(layers.map(async (layer, index) => {
    const imageBuffer = downloadedImages[index * 2];
    const maskBuffer = downloadedImages[index * 2 + 1];
    if (maskBuffer) {
      // Apply mask to image
      return sharp(imageBuffer)
        .composite([{ input: maskBuffer, blend: 'dest-in' }])
        .toBuffer();
    } else {
      return imageBuffer;
    }
  }));

  // Merge all processed images
  const buffer = await sharp({
    create: {
      width: 2048, // Set to your desired dimensions
      height: 2048,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite(processedImages.map(input => ({ input })))
    .toBuffer();


  // const imageUrls = layers.map((layer) => {
  //   return layer.image;
  // });

  // const images = await Promise.all(imageUrls.map(downloadImage))
  // const buffer = await sharp(images[0])
  //   .composite(images.slice(1).map(input =>
  //     ({ input }))
  //   )
  //   .toBuffer();
  return buffer
}

const downloadImage = async (url: string): Promise<Buffer> => {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(response.data);
};

export default {
  mergeImages
}