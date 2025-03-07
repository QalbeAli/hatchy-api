import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Route,
  Security,
  Tags,
} from "tsoa";
import { Contract } from "./contract";
import { ContractsService } from "./contracts-service";
import { CreateContractParams } from "./create-contract-params";

@Route("contracts")
@Tags("Contracts")
export class ContractsController extends Controller {
  @Get("")
  public async getContracts(
  ): Promise<Contract[]> {
    const contracts = await new ContractsService().getContracts();
    return contracts;
  }

  @Security("jwt", ["admin"])
  @Post("")
  public async createContract(
    @Body() body: CreateContractParams,
  ): Promise<Contract> {
    const contract = await new ContractsService().createContract(body);
    return contract;
  }

  @Security("jwt", ["admin"])
  @Put("{uid}")
  public async updateContract(
    uid: string,
    @Body() body: CreateContractParams,
  ): Promise<Contract> {
    const contract = await new ContractsService().updateContract(uid, body);
    return contract;
  }

  @Security("jwt", ["admin"])
  @Delete("{uid}")
  public async deleteContract(
    uid: string,
  ): Promise<void> {
    await new ContractsService().deleteContract(uid);
  }
}