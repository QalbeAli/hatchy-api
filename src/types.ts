export type Network =
  | "bsc-testnet"
  | "fuji"
  | "mumbai"
  | "arbitrum-goerli"
  | "fantom-testnet"
  | "ethereum"
  | "bsc"
  | "avalanche"
  | "polygon"
  | "arbitrum"
  | "fantom"
  | "hatchyverse-testnet";

export type ContractName =
  | "usdt"
  | "lpToken"
  | "hatchy"
  | "tokenSale"
  | "hatchypocketGen1"
  | "hatchypocketGen1ProxySale"
  | "hatchypocketGen1BatchTransfer"
  | "eggsGen2"
  | "hatchypocketGen2"
  | "hatchypocketStakingGen1"
  | "hatchypocketStakingGen2"
  | "hatchyReward"
  | "hatchyRewardDealer"
  | "omnigens"
  | "omnigensItems"
  | "mastersItems"
  | "mastersAvatars"
  | "hatchyTickets"
  | "joepegsTickets"
  | "hatchyLPStake"
  | "hatchyLPPair"
  | "hatchySalary";

export type NetworkData = {
  name: Network;
  rpc: string;
  label: string;
  layerzeroId: number;
  coingeckoId: string;
  chainId: number;
  icon: string;
  availableBridges: {
    token: number[];
  };
  addresses: Partial<Record<ContractName, string>>;
};
