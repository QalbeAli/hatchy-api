
import { ethers } from "ethers";
import ABI from "./ABI";
import config from "../config";
export const hatchyAddress = config.HATCHY_ADDRESS;
export const mastersItemsAddress = config.MASTERS_ITEMS_ADDRESS;
export const mastersPFPAddress = config.MASTERS_PFP_ADDRESS;
export const hatchyTicketsAddress = config.HATCHY_TICKETS_ADDRESS;

export const provider = new ethers.providers.JsonRpcProvider(
  config.JSON_RPC_URL
);
export const MastersItemsContract = new ethers.Contract(
  mastersItemsAddress,
  ABI.MastersItems,
  provider
);
export const MastersPFPContract = new ethers.Contract(
  mastersPFPAddress,
  ABI.MastersPFP,
  provider
);
export const HatchyTicketsContract = new ethers.Contract(
  hatchyTicketsAddress,
  ABI.HatchyTickets,
  provider
);
