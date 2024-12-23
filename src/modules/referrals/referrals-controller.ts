import {
  Body,
  Controller,
  Post,
  Request,
  Route,
  Security,
  Tags,
} from "tsoa";
import { BadRequestError } from "../../errors/bad-request-error";
import { MessageResponse } from "../../responses/message-response";
import { ReferralsService } from "./referrals-service";

@Route("referrals")
@Tags("Referrals")
export class ReferralsController extends Controller {
  /*
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
  */

  @Security("jwt")
  @Post("")
  public async setAccountReferrer(
    @Request() request: any,
    @Body() body: {
      referralCode: string;
    },
  ): Promise<MessageResponse> {
    if (!request.referralCode) {
      throw new BadRequestError("Invalid code");
    }
    return await new ReferralsService().setAccountReferrer(request.user.uid, body.referralCode);
  }

  /*
  @SuccessResponse("201", "Created") // Custom success response
  @Security("jwt")
  @Post("users")
  public async createUser(
    @Request() request: any,
  ): Promise<User> {
    const user = await new AuthService().createUser(request);
    this.setStatus(201); // set return status 201
    return user;
  }
  */
}