import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Request,
  Route,
  Security,
  Tags,
} from "tsoa";
import { User } from "./user";
import { UsersService } from "./usersService";
import { MessageResponse } from "../../responses/message-response";
import { Wallet } from "./wallet";

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
      referralCode?: string;
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
  @Get("wallets")
  public async getLinkedWallets(
    @Request() request: any,
  ): Promise<Wallet[]> {
    const linkedWallets = await this.usersService.getLinkedWallets(request.user.uid);
    return linkedWallets;
  }

  @Security("jwt")
  @Post("main-wallet")
  public async setMainWallet(
    @Request() request: any,
    @Body() body: {
      mainWallet: string
    },
  ): Promise<User> {
    const usersService = new UsersService();
    const user = await usersService.setMainWallet(request.user.uid, body.mainWallet);
    return user;
  }

  @Security("jwt")
  @Post("wallets/create")
  public async createWallet(
    @Request() request: any,
  ): Promise<{
    message: string;
    address: string;
  }> {
    const usersService = new UsersService();
    const wallet = await usersService.createWallet(request.user.uid);
    return {
      message: "Wallet created",
      address: wallet.address
    }
  }

  @Security("jwt", ["admin"])
  @Get("search")
  public async searchUsers(
    @Query() query: string,
  ): Promise<User> {
    const user = await this.usersService.searchUsers(query);
    return user;
  }
}