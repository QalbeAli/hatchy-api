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
import { AuthService } from "./authService";
import { isAddress } from "ethers/lib/utils";
import { AuthCustomToken } from "./authCustomToken";
import { WalletSignatureMessage } from "./walletSignatureMessage";
import { User } from "../users/user";
import { BadRequestError } from "../../errors/bad-request-error";

@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {
  @Get("wallet")
  public async getWalletAuthMessage(
    @Query() address: string,
  ): Promise<WalletSignatureMessage> {
    // const address = req.query.address as string;
    if (!address || !isAddress(address)) {
      throw new BadRequestError("Invalid address");
    }
    return await new AuthService().getWalletAuthMessage(address);
  }

  @SuccessResponse("201", "Created") // Custom success response
  @Post("wallet")
  public async postWalletAuthSignature(
    @Body() request: {
      address: string;
      signature: string;
    },
  ): Promise<AuthCustomToken> {
    if (!request.address || !isAddress(request.address) || !request.signature) {
      throw new BadRequestError("Invalid address or signature");
    }
    this.setStatus(201); // set return status 201
    return await new AuthService().postWalletAuthSignature(request.address, request.signature);
  }

  @SuccessResponse("201", "Created") // Custom success response
  @Security("jwt")
  @Post("users")
  public async createUser(
    @Request() request: any,
    @Body() body: {
      referralCode?: string;
    }
  ): Promise<User> {
    const user = await new AuthService().createUser(request, body.referralCode);
    this.setStatus(201); // set return status 201
    return user;
  }
}