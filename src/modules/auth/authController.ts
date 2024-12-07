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

@Route("auth")
@Tags("Auth")
export class AuthController extends Controller {
  @Security("jwt")
  @Get("wallet")
  public async getWalletAuthMessage(
    @Query() address: string,
  ): Promise<WalletSignatureMessage> {
    // const address = req.query.address as string;
    if (!address || !isAddress(address)) {
      this.setStatus(400); // set return status 400
      return;
    }
    return await new AuthService().getWalletAuthMessage(address);
  }

  @SuccessResponse("201", "Created") // Custom success response
  @Security("jwt")
  @Post("wallet")
  public async postWalletAuthSignature(
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
    return await new AuthService().postWalletAuthSignature(request.address, request.signature);
  }

  @SuccessResponse("201", "Created") // Custom success response
  @Security("jwt")
  @Post("users")
  public async createUser(
    @Request() request: any,
  ): Promise<User> {
    const user = await new AuthService().createUser({
      uid: request.user.uid,
      email: request.user.email,
      displayName: request.user.name,
      picture: request.user.picture,
      disabled: false,
    });
    this.setStatus(201); // set return status 201
    return user;
  }
}