import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Request,
  Route,
  Security,
  Tags,
} from "tsoa";
import { LeaderboardService } from "./leaderboard-service";
import { UsersService } from "../users/usersService";
import { GamesService } from "../games/games-service";
import { Score } from "./score";
import { Rank } from "./rank";

@Route("leaderboard")
@Tags("Leaderboard")
export class LeaderboardController extends Controller {
  @Security("jwt")
  @Post("scores")
  public async addScore(
    @Request() request: any,
    @Body() body: {
      gameId: string,
      score: number,
      apiKey?: string,
      clientId?: string,
    }
  ): Promise<Score> {
    const userService = new UsersService();
    const leaderboardService = new LeaderboardService();
    const gameService = new GamesService();
    const game = await gameService.getGameById(body.gameId);
    const user = await userService.get(request.user.uid);
    const score = await leaderboardService.addScore(
      game,
      user,
      body.score
    );
    return score;
  }

  @Get("scores/{gameId}")
  public async getScoreLeaderboard(
    @Path() gameId: string,
    @Query() limit?: number
  ): Promise<Score[]> {
    const leaderboardService = new LeaderboardService();
    return leaderboardService.getScoreLeaderboard(gameId, limit);
  }

  @Security("jwt")
  @Get("scores/{gameId}/me")
  public async getUserScore(
    @Request() request: any,
    @Path() gameId: string
  ): Promise<Score> {
    const leaderboardService = new LeaderboardService();
    return leaderboardService.getUserScore(gameId, request.user.uid);
  }

  @Security("jwt")
  @Post("rank")
  public async updateRank(
    @Request() request: any,
    @Body() body: {
      gameId: string,
      rank: number,
      apiKey?: string,
      clientId?: string,
    }
  ): Promise<Rank> {
    const userService = new UsersService();
    const leaderboardService = new LeaderboardService();
    const gameService = new GamesService();
    const game = await gameService.getGameById(body.gameId);
    const user = await userService.get(request.user.uid);
    const rank = await leaderboardService.updateRank(
      game,
      user,
      body.rank
    );
    return rank;
  }

  @Get("rank/{gameId}")
  public async getRankLeaderboard(
    @Path() gameId: string,
    @Query() limit?: number
  ): Promise<{ userId: string, rank: number }[]> {
    const leaderboardService = new LeaderboardService();
    return leaderboardService.getRankLeaderboard(gameId, limit);
  }

  @Security("jwt")
  @Get("rank/{gameId}/me")
  public async getUserRank(
    @Request() request: any,
    @Path() gameId: string
  ): Promise<Rank> {
    const leaderboardService = new LeaderboardService();
    return leaderboardService.getUserRank(gameId, request.user.uid);
  }
}