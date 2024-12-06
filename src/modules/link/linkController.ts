import {
  Body,
  Controller,
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

  @SuccessResponse("201", "Created") // Custom success response
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
}