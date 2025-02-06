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
import { DepositSignature } from "./deposit-signature";
import { BatchVoucherClaimSignature } from "./batch-voucher-claim-signature";

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

  @Security("api_key_rewards")
  @Post("apikey/give")
  public async giveVoucherWithApiKey(
    @Request() request: any,
    @Body() body: {
      email: string,
      assetId: string,
      amount: number,
    },
  ): Promise<MessageResponse> {
    if (!isEmail(body.email)) {
      throw new BadRequestError('Invalid email');
    }
    if (body.amount <= 0) {
      throw new BadRequestError('Amount must be greater than 0');
    }

    const voucherService = new VouchersService();
    await voucherService.giveVoucherWithApiKey(
      request.headers['x-api-key'],
      body.email,
      body.assetId,
      body.amount,
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
    if (body.receiverEmail === request.user.email) {
      throw new BadRequestError('Cannot transfer to yourself');
    }
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
  ): Promise<MessageResponse> {
    /*
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
    */
    return {
      message: 'Claim signature is disabled',
    }
  }

  @Security("jwt")
  @Post("claim/batch")
  public async getBatchVoucherClaimSignature(
    @Request() request: any,
    @Body() body: {
      voucherIds: string[],
      address: string,
    },
  ): Promise<MessageResponse> {
    /*
    if (!isAddress(body.address)) {
      throw new BadRequestError('Invalid address');
    }
    const voucherService = new VouchersService();
    const vouchers = await voucherService.getVouchersByIds(body.voucherIds);
    if (vouchers.some(v => v.userId !== request.user.uid)) {
      throw new UnauthorizedError();
    }
    if (vouchers.some(v => v.receiver && v.receiver !== body.address)) {
      throw new BadRequestError('Address is not receiver');
    }
    const claimSignatureData = await voucherService.getBatchVoucherClaimSignature(vouchers, body.address);
    return claimSignatureData;
    */
    return {
      message: 'Claim signature is disabled',
    }
  }

  @Security("jwt")
  @Delete("batch")
  public async deleteBatchVouchers(
    @Request() request: any,
    @Body() body: {
      voucherIds: string[],
    },
  ): Promise<MessageResponse> {
    const voucherService = new VouchersService();
    const vouchers = await voucherService.getVouchersByIds(body.voucherIds);
    if (vouchers.some(v => v.userId !== request.user.uid)) {
      throw new UnauthorizedError();
    }
    const message = await voucherService.deleteBatchVouchers(vouchers);
    return {
      message,
    };
  }

  @Post("deposit/sync")
  public async syncDepositedAssets(
    @Body() body: {
      receiver: string,
      depositId: number
    }
  ) {
    if (!isAddress(body.receiver)) {
      throw new BadRequestError('Invalid address');
    }
    const voucherService = new VouchersService();
    await voucherService.syncDepositedAssets(body.receiver, body.depositId);
    return {
      message: 'Deposited assets synced',
    }
  }

  @Post("deposit/signature")
  public async getDepositSignature(
    @Body() body: {
      receiver: string,
      assetType: 'ERC20' | 'ERC1155' | 'ERC721',
      assetAddress: string,
      tokenIds?: number[]
      amounts?: number[]; // only for erc1155
      amount?: number; // only for erc20
    },
  ): Promise<DepositSignature> {
    if (!isAddress(body.receiver)) {
      throw new BadRequestError('Invalid address');
    }

    if (body.assetType === 'ERC20') {
      if (!body.amount || body.amount <= 0) {
        throw new BadRequestError('Invalid amount');
      }
    } else if (body.assetType === 'ERC1155') {
      if (!body.amounts || body.amounts.length !== body.tokenIds.length) {
        throw new BadRequestError('Invalid amounts');
      }
      if (body.amounts.some(amount => amount <= 0)) {
        throw new BadRequestError('Invalid amounts');
      }
    } else if (body.assetType === 'ERC721') {
      if (body.tokenIds.length !== 1) {
        throw new BadRequestError('Invalid tokenIds');
      }
    } else {
      throw new BadRequestError('Invalid assetType');
    }

    const voucherService = new VouchersService();
    const depositSignature = await voucherService.getDepositSignature({
      receiver: body.receiver,
      assetType: body.assetType,
      assetAddress: body.assetAddress,
      tokenIds: body.tokenIds,
      amounts: body.amounts,
      amount: body.amount,
    });
    return depositSignature;
  }
}