import {
  Controller,
  Get,
  Request,
  Route,
  Security,
  Tags,
} from "tsoa";
import { Trade } from "./trade";
import { TradesService } from "./trades-service";

@Security("jwt")
@Route("trades")
@Tags("Trades")
export class TradesController extends Controller {
  @Get("")
  public async getTrades(): Promise<Trade[]> {
    const assets = await new TradesService().getTrades();
    return assets;
  }

  @Get("me")
  public async getMyTrades(
    @Request() request: any,
  ): Promise<Trade[]> {
    const assets = await new TradesService().getMyTrades(request.user.uid);

    return assets;
  }

  @Get("{id}")
  public async getTrade(id: string): Promise<Trade> {
    const asset = await new TradesService().getTrade(id);
    return asset;
  }
}