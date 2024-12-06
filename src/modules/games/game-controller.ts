import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  Route,
  Security,
  Tags,
} from "tsoa";
import { MessageResponse } from "../../responses/message-response";
import { GamesService } from "./games-service";
import { Game } from "./game";

@Route("games")
@Tags("Game")
export class GameController extends Controller {
  @Get("")
  public async getGame(
    @Query() id: string,
  ): Promise<Game> {
    const game = await new GamesService().getGameById(id);
    return game;
  }
}