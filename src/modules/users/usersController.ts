import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Route,
  Security,
  Tags,
} from "tsoa";
import { User } from "./user";
import { UsersService } from "./usersService";

@Route("users")
@Tags("Users")
export class UsersController extends Controller {
  @Security("jwt")
  @Get()
  public async getUser(
    @Request() request: any,
  ): Promise<User> {
    const usersService = new UsersService();
    const user = await usersService.get(request.user.uid);
    return user;
  }

  @Security("jwt")
  @Post("reward-receiver-address")
  public async setRewardReceiverAddress(
    @Request() request: any,
    @Body() body: {
      rewardReceiverAddress: string
    },
  ): Promise<User> {
    const usersService = new UsersService();
    const user = await usersService.setRewardReceiverAddress(request.user.uid, body.rewardReceiverAddress);
    return user;
  }
}