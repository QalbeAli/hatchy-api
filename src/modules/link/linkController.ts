import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Request,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from "tsoa";
import { WalletSignatureMessage } from "../auth/walletSignatureMessage";
import { isAddress } from "ethers/lib/utils";
import { LinkService } from "./linkService";
import { AuthCustomToken } from "../auth/authCustomToken";
import { MessageResponse } from "../../responses/message-response";

@Route("link")
@Tags("Link")
export class LinkController extends Controller {
  @Security("jwt")
  @Get("wallet")
  public async getWalletLinkMessage(
    @Request() request,
    @Query() address: string,
  ): Promise<WalletSignatureMessage> {
    if (!address || !isAddress(address)) {
      this.setStatus(400);
      return;
    }
    return new LinkService().getWalletLinkMessage(request.user.uid, address);
  }

  @Security("jwt")
  @Post("wallet")
  public async postWalletLinkSignature(
    @Request() req,
    @Body() request: {
      address: string;
      signature: string;
    },
  ): Promise<AuthCustomToken> {
    if (!request.address || !isAddress(request.address) || !request.signature) {
      this.setStatus(400); // set return status 400
      return;
    }
    this.setStatus(201); // set return status 201
    return new LinkService().postWalletLinkSignature(req.user.uid, request.address, request.signature);
  }

  @Security("jwt")
  @Delete("wallet")
  public async unlinkWallet(
    @Request() req,
    @Body() body: {
      address: string;
    },
  ): Promise<MessageResponse> {
    await new LinkService().unlinkWallet(req.user.uid, body.address);
    return {
      message: "Wallet unlinked",
    }
  }

  @Security("api_key")
  @Post("discord")
  public async getDiscordLink(
    @Body() body: {
      discordId: string,
      discordUsername: string,
      email: string,
    }
  ): Promise<{ url: string }> {
    const url = await new LinkService().getDiscordCode(body);
    return {
      url
    }
  }

  @Post("discord/verify")
  public async verifyDiscordConnect(
    @Body() body: {
      code: string;
    },
  ): Promise<MessageResponse> {
    await new LinkService().verifyDiscordCode(body.code);
    return {
      message: "Discord account linked"
    }
  }

  @Security("jwt")
  @Delete("discord")
  public async unlinkDiscord(
    @Request() req,
  ): Promise<MessageResponse> {
    await new LinkService().unlinkDiscord(req.user.uid);
    return {
      message: "Discord account unlinked"
    }
  }
}