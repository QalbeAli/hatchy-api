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
import { ScoreItem } from "./score";
import { RankItem } from "./rank";
// import { transformTimestampMiddleware } from "../../middlewares/transform-timestamp-middleware";

@Route("leaderboard")
// @Middlewares(transformTimestampMiddleware)
@Tags("Leaderboard")
export class LeaderboardController extends Controller {
  @Security("api_key_scores")
  @Post("scores")
  public async addScore(
    @Body() body: {
      appId: string,
      score: number,
      email: string,
    }
  ): Promise<ScoreItem> {
    const userService = new UsersService();
    const leaderboardService = new LeaderboardService();
    const gameService = new GamesService();
    const game = await gameService.getGameById(body.appId);
    const user = await userService.getUserByEmail(body.email);
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
  ): Promise<ScoreItem[]> {
    const leaderboardService = new LeaderboardService();
    return leaderboardService.getScoreLeaderboard(gameId, limit);
  }

  @Security("jwt")
  @Get("scores/{gameId}/me")
  public async getUserScore(
    @Request() request: any,
    @Path() gameId: string
  ): Promise<ScoreItem> {
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
  ): Promise<RankItem> {
    const userService = new UsersService();
    const leaderboardService = new LeaderboardService();
    const gameService = new GamesService();
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
  ): Promise<RankItem[]> {
    const leaderboardService = new LeaderboardService();
    return leaderboardService.getRankLeaderboard(appId, limit);
  }

  @Security("jwt")
  @Get("rank/{gameId}/me")
  public async getUserRank(
    @Request() request: any,
    @Path() gameId: string
  ): Promise<RankItem> {
    const leaderboardService = new LeaderboardService();
    return leaderboardService.getUserRank(gameId, request.user.uid);
  }
}