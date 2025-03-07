import { Contract } from "./contract";

export type CreateContractParams = Omit<Contract, "uid" | "owner">;