import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Request,
  Route,
  Security,
  Tags,
} from "tsoa";
import { VouchersService } from "./vouchers-service";
import { Voucher } from "./voucher";
import { VoucherClaimSignature } from "./voucher-claim-signature";
import { UnauthorizedError } from "../../errors/unauthorized-error";
import { isAddress } from "ethers/lib/utils";
import { BadRequestError } from "../../errors/bad-request-error";
import { BigNumber, ethers } from "ethers";
import { MessageResponse } from "../../responses/message-response";
import { isEmail } from "../../utils";

@Route("vouchers")
@Tags("Vouchers")
export class VouchersController extends Controller {
  @Security("jwt")
  @Get("")
  public async getVouchers(
    @Request() request: any,
  ): Promise<Voucher[]> {
    const vouchers = await new VouchersService().getVouchersOfUser(request.user.uid);
    return vouchers;
  }

  @Get("random")
  public async getRandomBigNumber(
  ): Promise<string> {
    return ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString();
  }

  @Security("jwt", ["admin"])
  @Post("admin/give")
  public async giveVoucherToUser(
    @Body() body: {
      email: string,
      assetId: string,
      amount: number,
      overrideTokenId?: string
    },
  ): Promise<MessageResponse> {
    const voucherService = new VouchersService();

    if (!isEmail(body.email)) {
      throw new BadRequestError('Invalid email');
    }
    await voucherService.giveVoucherToUser(
      body.email,
      body.assetId,
      body.amount,
      body.overrideTokenId
    );
    return {
      message: 'Voucher given',
    }
  }

  @Security("jwt")
  @Post("transfer")
  public async transferVouchers(
    @Request() request: any,
    @Body() body: {
      voucherIds: string[],
      voucherAmounts: number[],
      receiverEmail: string,
    },
  ): Promise<MessageResponse> {
    const voucherService = new VouchersService();
    await voucherService.transferVouchers(request.user.uid, body.voucherIds, body.voucherAmounts, body.receiverEmail);
    return {
      message: 'Vouchers transferred',
    }
  }

  @Security("jwt")
  @Post("claim")
  public async getVoucherClaimSignature(
    @Request() request: any,
    @Body() body: {
      voucherId: string,
      address: string,
    },
  ): Promise<VoucherClaimSignature> {
    const voucherService = new VouchersService();
    const voucher = await voucherService.getVoucherById(body.voucherId);
    if (!isAddress(body.address)) {
      throw new BadRequestError('Invalid address');
    }
    if (voucher.userId !== request.user.uid) {
      throw new UnauthorizedError();
    }
    if (voucher.receiver && voucher.receiver !== body.address) {
      throw new BadRequestError('Address is not receiver');
    }
    const claimSignatureData = await voucherService.getVoucherClaimSignature(voucher, body.address);
    return claimSignatureData;
  }

  @Security("jwt")
  @Delete("{voucherId}")
  public async deleteVoucher(
    @Request() request: any,
    @Path() voucherId: string,
  ): Promise<MessageResponse> {
    const voucherService = new VouchersService();
    const voucher = await voucherService.getVoucherById(voucherId);
    if (voucher.userId !== request.user.uid) {
      throw new UnauthorizedError();
    }
    const message = await voucherService.deleteVoucher(voucher);
    return {
      message,
    };
  }
}