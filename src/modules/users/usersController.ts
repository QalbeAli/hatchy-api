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
import { User } from "./user";
import { UsersService } from "./usersService";
import { MessageResponse } from "../../responses/message-response";

@Route("users")
@Tags("Users")
export class UsersController extends Controller {
  private usersService: UsersService;

  constructor() {
    super();
    this.usersService = new UsersService();
  }

  @Security("jwt")
  @Get()
  public async getUser(
    @Request() request: any,
  ): Promise<User> {
    const user = await this.usersService.get(request.user.uid);
    return user;
  }

  @Security("jwt")
  @Put()
  public async updateUser(
    @Request() request: any,
    @Body() body: {
      displayName?: string;
      bio?: string;
    },
  ): Promise<User> {
    const user = await this.usersService.update(request.user.uid, body);
    return user;
  }

  @Security("jwt")
  @Delete()
  public async deleteAccount(
    @Request() request: any,
  ): Promise<MessageResponse> {
    await this.usersService.deleteAccount(request.user.uid);
    return { message: "Account deleted" };
  }

  @Security("jwt")
  @Get("roles")
  public async getRoles(
  ): Promise<string[]> {
    return ['user'];
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