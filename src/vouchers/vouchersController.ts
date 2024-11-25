import {
  Controller,
  Get,
  Request,
  Route,
  Security,
  Tags,
} from "tsoa";
import { VouchersService } from "./vouchersService";
import { Voucher } from "./voucher";

@Route("vouchers")
@Tags("Vouchers")
export class VouchersController extends Controller {
  @Security("jwt")
  @Get("")
  public async getVouchers(
    @Request() request: any,
  ): Promise<Voucher[]> {
    const vouchers = await new VouchersService().getVouchersOfUser(request.user.uid);
    return vouchers;
  }

}