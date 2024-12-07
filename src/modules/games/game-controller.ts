import {
  Controller,
  Get,
  Query,
  Route,
  Tags,
} from "tsoa";
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

  @Get("list")
  public async getGames(
  ): Promise<Game[]> {
    const games = await new GamesService().getGames();
    return games;
  }
}