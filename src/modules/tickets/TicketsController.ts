import {
  Controller,
  Get,
  Path,
  Query,
  Route,
  Tags,
} from "tsoa";
import { isAddress } from "ethers/lib/utils";
import { DefaultChainId } from "../contracts/networks";
import { TicketsService } from "../../services/TicketsService";
import { Ticket } from "./ticket";
import { TicketBalance } from "./ticketBalance";

@Route("tickets")
@Tags("Tickets")
export class TicketsController extends Controller {
  @Get("metadata")
  public async getTicketsMetadata(
  ): Promise<{
    name: string;
  }> {
    return {
      name: "Hatchyverse Tickets",
    }
  }

  @Get("balance/{address}")
  public async getTicketsBalance(
    @Path() address: string,
    @Query() chainId?: number,
  ): Promise<TicketBalance[]> {
    if (!isAddress(address)) {
      this.setStatus(400);
      return // messageResponse(res, 400, 'Invalid address');     

    }
    const ticketsService = new TicketsService(chainId || DefaultChainId);
    const tickets = await ticketsService.getTicketsBalance(address);
    return tickets;
  }

  @Get("")
  public async getTickets(
    @Query() chainId?: number,
  ): Promise<Ticket[]> {
    const ticketsService = new TicketsService(chainId || DefaultChainId);
    const tickets = await ticketsService.getTickets();
    return tickets;
  }

  @Get("{id}")
  public async getTicket(
    @Path() id: number,
    @Query() chainId?: number,
  ): Promise<Ticket> {
    if (isNaN(id)) {
      this.setStatus(400);
      return // messageResponse(res, 400, "Invalid id");
    }
    const ticketsService = new TicketsService(chainId || DefaultChainId);
    const ticket = await ticketsService.getTicket(id);
    return ticket;
  }
}