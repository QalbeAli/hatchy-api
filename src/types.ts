import { Request } from 'express';
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
  | "hatchyverse"
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
  | "hatchySalary"
  | "voucherConverter"
  | "gameLeaderboard"
  | "gameRanks"
  ;

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

export interface AuthorizedRequest extends Request {
  user?: {
    uid: string;
    [key: string]: any;
  }
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  disabled: boolean;
  bio: string;
  xpPoints: number;
  rewardReceiverAddress: string;
  wallets?: {
    address: string;
    nonce: string;
    linked: boolean;
    createdAt: number;
  }[];
}

export type UserRole = 'user' | 'admin' | 'content_creator' | 'game_developer';
export interface UserClaims {
  roles: UserRole[];
  [key: string]: any;
}

export interface UserMigrationData {
  user: {
    linkedWallets?: {
      linked: boolean,
      username: string,
    }[],
    discordConfirmed?: boolean,
    discordId?: string,
    verificationCode?: string,
    discordUsername?: string,
    username?: string,
    address: string,
    lastBadgesUpdate?: number,
    type?: string,
    xpPoints?: number,
    airdropPoints?: number,
    bio?: string,
    profilePicture?: string,
    linkedGoogle?: [],
    rewardReceiverAddress?: string,
  },
  vouchers: {
    contractType: "ERC20" | "ERC721" | "ERC1155",
    holder?: string,
    image: string,
    category: string,
    amount: number,
    username: string,
    contract: string,
    receiver?: string,
    id: number,
    name: string,
    type: "blockchain" | "game",
    tokenId?: string
  }[],
  gameSaves: {
    saveName: string,
    date: string,
    saveId: string,
    username: string,
    gameId: string,
    blockchainRewards: any
  }[],
  referrer: {
    referral: string,
    referrer: string,
    email: string
  },
  referrals: {
    referral: string,
    referrer: string,
    email: string
  }[],

}