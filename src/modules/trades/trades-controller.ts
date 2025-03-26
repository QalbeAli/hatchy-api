import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  Route,
  Security,
  Tags,
} from "tsoa";
import { Trade } from "./trade";
import { TradesService } from "./trades-service";
import { MessageResponse } from "../../responses/message-response";
import { BadRequestError } from "../../errors/bad-request-error";
import { VouchersService } from "../vouchers/vouchers-service";

@Route("trades")
@Tags("Trades")
export class TradesController extends Controller {
  @Get("")
  public async getTrades(): Promise<Trade[]> {
    const assets = await new TradesService().getTrades();
    return assets;
  }

  @Security("jwt")
  @Get("me")
  public async getMyTrades(
    @Request() request: any,
  ): Promise<Trade[]> {
    const assets = await new TradesService().getMyTrades(request.user.uid);

    return assets;
  }

  @Security("jwt")
  @Post("")
  public async createTrade(
    @Request() request: any,
    @Body() body: {
      requestAssetsIds: string[],
      requestAmounts: number[],
      offerVoucherIds: string[],
      offerAmounts: number[]
    },
  ): Promise<MessageResponse> {
    if (body.requestAmounts.some(amount => amount <= 0)) {
      throw new BadRequestError('Invalid amounts');
    }
    if (body.offerAmounts.some(amount => amount <= 0)) {
      throw new BadRequestError('Invalid amounts');
    }
    if (body.requestAssetsIds.length !== body.requestAmounts.length) {
      throw new BadRequestError('Request assets ids and amounts must have the same length');
    }
    if (body.offerVoucherIds.length !== body.offerAmounts.length) {
      throw new BadRequestError('Offer assets ids and amounts must have the same length');
    }
    const voucherService = new VouchersService();
    await voucherService.createTrade(
      request.user.uid,
      body.requestAssetsIds,
      body.requestAmounts,
      body.offerVoucherIds,
      body.offerAmounts,
    );

    return {
      message: 'Trade created',
    }
  }

  @Get("{id}")
  public async getTrade(id: string): Promise<Trade> {
    const asset = await new TradesService().getTrade(id);
    return asset;
  }

  @Security("jwt")
  @Delete("{id}")
  public async deleteTrade(id: string): Promise<void> {
    await new TradesService().deleteTrade(id);
  }

  @Security("jwt")
  @Post("accept/{id}")
  public async acceptTrade(
    @Request() request: any,
    id: string
  ): Promise<void> {
    await new TradesService().acceptTrade(request.user.uid, id);
  }
}