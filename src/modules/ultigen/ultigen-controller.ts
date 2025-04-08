import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Request,
  Route,
  Security,
  Tags,
} from "tsoa";
import { UltigenService } from "./ultigen-service";
import { UltigenEggsBalance } from "./ultigen-eggs-balance";
import { MessageResponse } from "../../responses/message-response";
import { isEmail } from "../../utils";
import { BadRequestError } from "../../errors/bad-request-error";
import { UltigenMonster } from "./ultigen-monster";

const validEggTypes = [1];
@Route("ultigen")
@Tags("Ultigen")
export class UltigenController extends Controller {
  @Security("jwt")
  @Get("monsters/balance")
  public async getUltigenMonstersBalance(
    @Request() request: any,
  ): Promise<UltigenMonster[]> {
    const ultigenService = new UltigenService(8198);
    const balances = await ultigenService.getUltigenMonstersBalance(request.user.uid);
    return balances;
  }

  @Security("jwt")
  @Get("eggs/balance")
  public async getUltigenEggsBalance(
    @Request() request: any,
  ): Promise<UltigenEggsBalance[]> {
    const ultigenService = new UltigenService(8198);
    const balances = await ultigenService.getEggsBalance(request.user.uid);
    return balances;
  }

  @Security("jwt")
  @Post("eggs/hatch")
  public async hatchEggs(
    @Request() request: any,
    @Body() body: {
      eggType: number,
      amount: number,
    },
  ): Promise<UltigenMonster[]> {
    const ultigenService = new UltigenService(8198);
    const { eggType, amount } = body;
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new BadRequestError('Invalid amount');
    }
    if (!Number.isInteger(eggType) || !validEggTypes.includes(eggType)) {
      throw new BadRequestError('Invalid egg type');
    }

    const monsterData = await ultigenService.hatchEggs(
      request.user.uid,
      eggType,
      amount,
    );
    return monsterData;
  }

  @Security("jwt")
  @Post("eggs/buy")
  public async buyEggs(
    @Request() request: any,
    @Body() body: {
      eggType: number,
      amount: number,
    },
  ): Promise<MessageResponse> {
    const ultigenService = new UltigenService(8198);
    const { eggType, amount } = body;
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new BadRequestError('Invalid amount');
    }
    if (!Number.isInteger(eggType) || !validEggTypes.includes(eggType)) {
      throw new BadRequestError('Invalid egg type');
    }

    await ultigenService.buyEggs(
      request.user.uid,
      eggType,
      amount,
    );
    return {
      message: 'Eggs bought',
    }
  }

  @Security("api_key_rewards")
  @Post("eggs/give")
  public async giveEggWithApiKey(
    @Request() request: any,
    @Body() body: {
      email: string,
      eggType: number,
      amount: number,
    },
  ): Promise<MessageResponse> {
    const ultigenEggsAssetId = '3kmi5JUTByJhyb17DRxt';

    if (!isEmail(body.email)) {
      throw new BadRequestError('Invalid email');
    }
    if (body.amount <= 0) {
      throw new BadRequestError('Amount must be greater than 0');
    }
    if (!Number.isInteger(body.eggType) || !validEggTypes.includes(body.eggType)) {
      throw new BadRequestError('Invalid egg type');
    }

    const ultigenService = new UltigenService(8198);
    const data = await ultigenService.giveEggWithApiKey(
      request.headers['x-api-key'],
      body.email,
      ultigenEggsAssetId,
      body.eggType,
      body.amount,
    );
    return {
      message: 'Egg given',
      // ...data
    }
  }

  @Security("api_key_ultigen_xp")
  @Post("monsters/xp")
  public async giveXPToMonster(
    @Request() request: any,
    @Body() body: {
      id: number,
      xp: number,
    },
  ): Promise<UltigenMonster> {

    if (body.xp <= 0) {
      throw new BadRequestError('xp must be greater than 0');
    }
    if (!Number.isInteger(body.id)) {
      throw new BadRequestError('Invalid id');
    }

    const ultigenService = new UltigenService(8198);
    const data = await ultigenService.giveXPToMonster(
      body.id,
      body.xp,
    );
    return data;
  }

  @Get("monsters/{id}")
  public async getMonsterData(
    @Path() id: number,
  ): Promise<UltigenMonster> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestError('Invalid id');
    }
    const ultigenService = new UltigenService(8198);
    const data = await ultigenService.getMonsterData(
      id
    );
    return data;
  }
}