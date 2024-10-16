import { BigNumber, ethers } from "ethers";
import { DefaultChainId, getContract } from "../contracts/networks";
import { DI } from "..";

export class TicketsService {
  chainId: number;

  constructor(chainId?: number) {
    this.chainId = chainId || DefaultChainId;
  }

  async getTicket(id: number) {
    const ticket = await DI.tickets.findOne(id, {
      populate: ['prices'],
    });
    const ticketsContract = getContract('hatchyTickets', this.chainId);
    const prices = await Promise.all(
      ticket.prices.map(async (priceData) => {
        const _price: BigNumber = await ticketsContract.getTicketPrice(ticket.id, priceData.address);
        let denom = BigNumber.from(10).pow(priceData.decimals)
        let ans = _price.div(denom).toNumber()
        const formattedPrice = ethers.utils.formatUnits(_price, priceData.decimals);
        return ({
          currency: priceData.currency,
          decimals: priceData.decimals,
          address: priceData.address,
          image: priceData.image,
          price: formattedPrice
        });
      })
    );
    return {
      ...ticket,
      prices
    };
  }

  async getTickets() {
    const ticketsContract = getContract('hatchyTickets', this.chainId);
    const tickets = await DI.tickets.findAll({
      populate: ['prices'],
    });
    const ticketsPriced = await Promise.all(
      tickets.map(async (ticket) => {
        const prices = await Promise.all(
          ticket.prices.map(async (priceData) => {
            const _price: BigNumber = await ticketsContract.getTicketPrice(ticket.id, priceData.address);
            let denom = BigNumber.from(10).pow(priceData.decimals)
            let ans = _price.div(denom).toNumber()
            //console.log(ans)
            const formattedPrice = ethers.utils.formatUnits(_price, priceData.decimals);
            return ({
              currency: priceData.currency,
              decimals: priceData.decimals,
              address: priceData.address,
              image: priceData.image,
              price: formattedPrice
            });
          })
        );
        return {
          ...ticket,
          prices
        };
      })
    );
    return ticketsPriced;
  }

  async getTicketsBalance(address: string) {
    const tickets = await DI.tickets.findAll();
    const ticketsContract = getContract('hatchyTickets', this.chainId);

    const balance: BigNumber[] = await ticketsContract.balanceOfBatch(
      Array(tickets.length).fill(address),
      tickets.map((i) => i.id)
    );

    const ticketsBalance = [];
    balance.forEach((b, i) => {
      //if (b.gt(0)) {
      ticketsBalance.push({
        balance: b.toNumber(),
        ...tickets[i]
      });
      //}
    });
    return ticketsBalance;
  }
}