import {
  Body,
  Controller,
  Get,
  Header,
  Path,
  Post,
  Query,
  Route,
  Tags,
} from "tsoa";
import { DefaultChainId } from "../contracts/networks";
import { MastersService } from "../services/MastersService";
import { isAddress } from "ethers/lib/utils";
import axios from "axios";
import ImageService from "../services/ImageService";
import config from "../config";
import { BigNumber } from "ethers";
import { MastersAvatar } from "./models/MastersAvatar";

const uploadImage = async (buffer: Buffer, uploadUrl: string) => {
  await axios.put(uploadUrl, buffer, {
    headers: {
      "Content-Type": "image/png",
      "Content-Encoding": "base64",
    },
  });
  console.log("Image uploaded successfully ");
};

@Route("masters")
@Tags("Masters")
export class AvatarsController extends Controller {
  @Post("avatars/image/{tokenId}")
  public async updateImage(
    @Path() tokenId: number,
    @Query() chainId?: number,
    @Query() extension?: number,
  ): Promise<{
    message: string
  }> {
    const fileExtension = (extension || "png") as string;
    const mastersService = new MastersService(chainId || DefaultChainId);
    const avatarData = await mastersService.getAvatarImageUploadURL(tokenId, fileExtension);
    const { uploadUrl, layers } = avatarData;

    const b64 = await ImageService.mergeImages(layers);
    await uploadImage(b64, uploadUrl);
    return {
      message: "Image updated successfully",
    };
  }

  @Get("avatars/image-upload-url/{tokenId}")
  public async getMastersPFPImageUploadURL(
    @Path() tokenId: number,
    @Query() extension?: string,
    @Query() chainId?: number,
    @Header("Authorization") authorization?: string,
  ): Promise<{
    uploadUrl: string,
    layers: any[],
    tokenId: number
  }> {
    const fileExtension = extension as string || "png";
    const apiKey = authorization?.split(" ")[1];
    if (apiKey !== config.IMAGE_API_KEY) {
      this.setStatus(401);
      return; // messageResponse(res, 401, "Invalid Access");
    }

    const mastersService = new MastersService(chainId || DefaultChainId);
    const avatarData = await mastersService.getAvatarImageUploadURL(tokenId, fileExtension);
    return {
      ...avatarData,
      tokenId,
    };
  }

  @Get("avatars/images/{address}")
  public async getMastersAvatarImage(
    @Path() address: string,
    @Query() chainId?: number,
  ): Promise<{
    type: string,
    name: string,
    profilePictures: string[],
  }> {
    if (!isAddress(address)) {
      this.setStatus(400);
      return // messageResponse(res, 400, "Invalid address");     
    }
    const mastersService = new MastersService(chainId || DefaultChainId);
    const avatarsBalance = await mastersService.getAvatarsImages(address);
    return avatarsBalance;
  }

  @Get("avatars/balance/{address}")
  public async getMastersAvatarBalance(
    @Path() address: string,
    @Query() chainId?: number,
  ): Promise<any[]> {
    if (!isAddress(address)) {
      this.setStatus(404);
      return // messageResponse(res, 404, 'Invalid address');
    }
    const mastersService = new MastersService(chainId || DefaultChainId);
    const avatarsBalance = await mastersService.getAvatarsBalance(address);
    return avatarsBalance;
  }

  @Get("avatars/prices")
  public async getMastersAvatarPrices(
    @Query() chainId?: number,
  ): Promise<any[]> {
    const mastersService = new MastersService(chainId || DefaultChainId);
    const prices = await mastersService.getAvatarsPrices();
    return prices;
  }

  @Post("avatars/free")
  public async getMastersFreePFPSignature(
    @Body() body: {
      receiver?: string,
      traits: number[]
    },
    @Query() chainId?: number,
  ): Promise<{
    receiver: string;
    traits: number[];
    nonce: BigNumber;
    signature: string;
  }> {
    const {
      receiver,
      traits,
    } = body;
    if (!isAddress(receiver)) {
      this.setStatus(400);
      return // messageResponse(res, 400, "Invalid address");
    }
    const mastersService = new MastersService(chainId || DefaultChainId);

    const validTraits = await mastersService.isValidTraits(traits);
    if (!validTraits) {
      this.setStatus(400);
      return // messageResponse(res, 400, "Invalid traits");
    }
    const signatureData = await mastersService.getAvatarFreeMintSignature(receiver, traits);
    return signatureData;
  }

  @Get("avatars/{tokenId}")
  public async getMastersAvatar(
    @Path() tokenId: string,
    @Query() chainId?: number,
  ): Promise<MastersAvatar> {
    if (isNaN(Number(tokenId))) {
      this.setStatus(400);
      return; // messageResponse(res, 400, "Invalid tokenId");
    }

    const mastersService = new MastersService(chainId || DefaultChainId);
    const avatar = await mastersService.getAvatar(Number(tokenId));
    return (avatar as unknown) as MastersAvatar;
  }

  @Post("avatars")
  public async getMastersPFPSignature(
    @Body() body: {
      receiver?: string,
      traits: number[],
      currency: string,
      payWithTicket: boolean
    },
    @Query() chainId?: number,
  ): Promise<any> {
    const {
      receiver,
      traits,
      currency,
      payWithTicket
    } = body;
    if (!isAddress(receiver)) {
      this.setStatus(400);
      return // messageResponse(res, 400, "Invalid address");
    }
    const mastersService = new MastersService(chainId);

    const validTraits = await mastersService.isValidTraits(traits);
    if (!validTraits) {
      this.setStatus(400);
      return // messageResponse(res, 400, "Invalid traits");
    }

    if (payWithTicket === true) {
      //return messageResponse(400, "Pay with ticket must be true or undefined");
      const signatureData = await mastersService.getAvatarMintSignature(receiver, traits, currency, true);
      return signatureData;
    } else {
      const price = await mastersService.getAvatarPrice(currency);
      if (!price) {
        this.setStatus(400);
        return // messageResponse(res, 400, "Invalid currency");
      }
      const signatureData = await mastersService.getAvatarMintSignature(receiver, traits, currency, false);
      return signatureData;
    }
  }
}