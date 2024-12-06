import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Request,
  Route,
  Security,
  Tags,
} from "tsoa";
import { GamesService } from "./games-service";
import { GamesSavesService } from "./games-saves-service";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { GameSave } from "./game-save";

@Route("games")
@Tags("Game")
export class GameSavesController extends Controller {
  @Security("jwt")
  @Delete("saves/{saveId}")
  public async deleteGameSave(
    @Request() request: any,
    @Path() saveId: string,
  ): Promise<void> {
    const gameSavesService = new GamesSavesService();
    const gameSave = await gameSavesService.getGameSaveById(saveId);
    if (gameSave.userId !== request.user.uid) {
      throw new UnauthorizedError();
    }
    await gameSavesService.deleteGameSave(saveId);
  }

  @Security("jwt")
  @Put("saves/{saveId}")
  public async updateGameSave(
    @Request() request: any,
    @Path() saveId: string,
    @Body() body: {
      data: {
        [key: string]: any
      },
    },
  ): Promise<GameSave> {
    const gameSavesService = new GamesSavesService();
    const gameSave = await gameSavesService.getGameSaveById(saveId);
    if (gameSave.userId !== request.user.uid) {
      throw new Error('game not found or you are not authorized to save this game');

    }

    const newGameSave = await gameSavesService.updateGameSave(
      saveId,
      body.data,
    );
    return newGameSave;
  }

  @Security("jwt")
  @Get("saves/{saveId}")
  public async getGameSave(
    @Request() request: any,
    @Path() saveId: string,
  ): Promise<GameSave> {
    const gameSavesService = new GamesSavesService();
    const gameSave = await gameSavesService.getGameSaveById(saveId);
    if (gameSave.userId !== request.user.uid) {
      throw new UnauthorizedError();
    }
    return gameSave;
  }

  @Security("jwt")
  @Post("saves")
  public async createGameSave(
    @Request() request: any,
    @Body() body: {
      gameId: string,
      data: {
        [key: string]: any
      },
      saveName?: string,
    },
  ): Promise<GameSave> {
    const gameService = new GamesService();
    const gameSavesService = new GamesSavesService();
    const game = await gameService.getGameById(body.gameId);
    const _saveName = body.saveName || 'default';
    const gameSave = await gameSavesService.createGameSave(
      body.gameId,
      request.user.uid,
      body.data,
      _saveName
    );
    return gameSave;
  }

  @Security("jwt")
  @Get("saves")
  public async getAllGameSaves(
    @Request() request: any,
  ): Promise<GameSave[]> {
    const gameSavesService = new GamesSavesService();
    const gameSaves = await gameSavesService.getAllUserGameSaves(request.user.uid);
    return gameSaves;
  }
}