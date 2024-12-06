import {
  Controller,
  Get,
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
}