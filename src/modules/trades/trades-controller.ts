import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
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
    // validate that all the request assets ids are different

    const requestAssetsIdsSet = new Set(body.requestAssetsIds);
    if (requestAssetsIdsSet.size !== body.requestAssetsIds.length) {
      throw new BadRequestError('Request assets ids must be unique');
    }
    // validate that all the offer assets ids are different
    const offerAssetsIdsSet = new Set(body.offerVoucherIds);
    if (offerAssetsIdsSet.size !== body.offerVoucherIds.length) {
      throw new BadRequestError('Offer assets ids must be unique');
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

  @Security("jwt")
  @Put("{id}")
  public async updateTrade(
    id: string,
    @Request() request: any,
    @Body() body: {
      requestAssetsIds: string[],
      requestAmounts: number[],
      offerVoucherIds: string[],
      offerAmounts: number[]
    },
  ): Promise<void> {
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
    // validate that all the request assets ids are different

    const requestAssetsIdsSet = new Set(body.requestAssetsIds);
    if (requestAssetsIdsSet.size !== body.requestAssetsIds.length) {
      throw new BadRequestError('Request assets ids must be unique');
    }
    // validate that all the offer assets ids are different
    const offerAssetsIdsSet = new Set(body.offerVoucherIds);
    if (offerAssetsIdsSet.size !== body.offerVoucherIds.length) {
      throw new BadRequestError('Offer assets ids must be unique');
    }
    const tradesService = new TradesService();
    const currentTrade = await tradesService.getTrade(id);
    if (currentTrade.userId !== request.user.uid) {
      throw new BadRequestError('Trade does not belong to user');
    }
    await new TradesService().updateTrade(
      id,
      request.user.uid,
      body.requestAssetsIds,
      body.requestAmounts,
      body.offerVoucherIds,
      body.offerAmounts
    );
  }


  @Get("{id}")
  public async getTrade(id: string): Promise<Trade> {
    const asset = await new TradesService().getTrade(id);
    return asset;
  }

  @Security("jwt")
  @Delete("{id}")
  public async deleteTrade(
    id: string,
    @Request() request: any,
  ): Promise<void> {
    const tradesService = new TradesService();
    const currentTrade = await tradesService.getTrade(id);
    if (currentTrade.userId !== request.user.uid) {
      throw new BadRequestError('Trade does not belong to user');
    }
    await new TradesService().deleteTrade(id);
  }

  @Security("jwt")
  @Post("{id}/offer")
  public async submitOffer(
    id: string,
    @Request() request: any,
    @Body() body: {
      offerVoucherIds: string[],
      offerAmounts: number[]
    }
  ): Promise<MessageResponse> {
    if (body.offerAmounts.some(amount => amount <= 0)) {
      throw new BadRequestError("Invalid offer amounts");
    }
    if (body.offerVoucherIds.length !== body.offerAmounts.length) {
      throw new BadRequestError("Offer voucher IDs and amounts must have the same length");
    }
    // validate that all the offer assets ids are different
    const offerAssetsIdsSet = new Set(body.offerVoucherIds);
    if (offerAssetsIdsSet.size !== body.offerVoucherIds.length) {
      throw new BadRequestError('Offer assets ids must be unique');
    }

    const userId = request.user.uid;

    await new TradesService().submitOffer(id, userId, body.offerVoucherIds, body.offerAmounts);

    return {
      message: "Offer submitted successfully",
    };
  }

  @Security("jwt")
  @Post("acceptOffer/{tradeId}")
  public async acceptOffer(
    @Request() request: any,
    tradeId: string,
    @Body() body: { offerUserId: string }
  ): Promise<{ message: string }> {
    if (!body.offerUserId) {
      throw new BadRequestError("Offer user ID is required");
    }

    await new TradesService().acceptOffer(request.user.uid, tradeId, body.offerUserId);

    return { message: "Offer accepted successfully" };
  }

  @Security("jwt")
  @Post("{id}/accept")
  public async acceptTrade(
    @Request() request: any,
    id: string
  ): Promise<MessageResponse> {
    await new TradesService().acceptTrade(request.user.uid, id);
    return {
      message: "Trade accepted successfully"
    }
  }
}