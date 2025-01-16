import {
  Body,
  Controller,
  Get,
  Middlewares,
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
// import { transformTimestampMiddleware } from "../../middlewares/transform-timestamp-middleware";

@Route("leaderboard")
// @Middlewares(transformTimestampMiddleware)
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

  @Security("api_key_rank")
  @Post("rank")
  public async updateRank(
    @Body() body: {
      appId: string,
      rank: number,
      userId: string,
    }
  ): Promise<Rank> {
    const userService = new UsersService();
    const leaderboardService = new LeaderboardService();
    const gameService = new GamesService();
    console.log(body);
    const game = await gameService.getGameById(body.appId);
    const user = await userService.get(body.userId);
    const rank = await leaderboardService.updateRank(
      game,
      user,
      body.rank
    );
    return rank;
  }

  @Get("rank/{appId}")
  public async getRankLeaderboard(
    @Path() appId: string,
    @Query() limit?: number
  ): Promise<{ userId: string, rank: number }[]> {
    const leaderboardService = new LeaderboardService();
    return leaderboardService.getRankLeaderboard(appId, limit);
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