import * as MastersItems from "./MastersItems.json";
import * as MastersPFP from "./MastersAvatars.json";
import * as HatchyTickets from "./HatchyTickets.json";
import TokenSaleABI from "./HatchyTokenSaleV2.json";
import erc20 from "./erc20.json";
import hatchypocketGen2EggsABI from "./HatchyPocketEggsGen2.json";
import hatchypocketGen1ABI from "./hatchypocketGen1.json";
import hatchypocketGen1ProxySaleABI from "./HatchyGen1ProxySale.json";
import hatchypocketGen2ABI from "./hatchypocketGen2.json";
import hatchypocketStakingGen1ABI from "./hatchypocketGen1Staking.json";
import hatchypocketStakingGen2ABI from "./hatchypocketGen2Staking.json";
import hatchypocketGen1BatchTransferABI from "./hatchypocketGen1BatchTransfer.json";
import hatchyReward from "./HatchyReward.json";
import hatchyRewardDealer from "./HatchyRewardDealer.json";
import hatchyLPStakeABI from "./HatchyLPStake.json";
import hatchySalary from "./HatchySalary.json";
import voucherConverter from "./VoucherConverter.json";
import gameLeaderboard from "./GameLeaderboard.json";
import gameRanks from "./GameRanks.json";

export default {
  mastersItems: MastersItems.abi,
  mastersAvatars: MastersPFP.abi,
  hatchyTickets: HatchyTickets.abi,
  joepegsTickets: HatchyTickets.abi,
  tokenSale: TokenSaleABI.abi,
  erc20: erc20,
  hatchy: erc20,
  eggsGen2: hatchypocketGen2EggsABI.abi,
  hatchypocketGen1: hatchypocketGen1ABI,
  hatchypocketGen1ProxySale: hatchypocketGen1ProxySaleABI.abi,
  hatchypocketGen2: hatchypocketGen2ABI.abi,
  hatchypocketStakingGen1: hatchypocketStakingGen1ABI.abi,
  hatchypocketStakingGen2: hatchypocketStakingGen2ABI.abi,
  hatchypocketGen1BatchTransfer: hatchypocketGen1BatchTransferABI.abi,
  hatchyReward: hatchyReward.abi,
  hatchyRewardDealer: hatchyRewardDealer.abi,
  hatchyLPStake: hatchyLPStakeABI.abi,
  hatchySalary: hatchySalary.abi,
  voucherConverter: voucherConverter.abi,
  gameLeaderboard: gameLeaderboard.abi,
  gameRanks: gameRanks.abi,
};
