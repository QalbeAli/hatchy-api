import { ethers, Wallet } from "ethers";
import config from "../../config";
import { ContractName, NetworkData } from "../../types";
import ABI from "./ABI";
export const DefaultChainId = config.NODE_ENV == "dev" ? 43113 : 43114;

const prodNetworks: Map<number, NetworkData> = new Map([
  [
    43114,
    {
      name: "avalanche",
      rpc: "https://api.avax.network/ext/bc/C/rpc",
      label: "Avalanche",
      layerzeroId: 106,
      coingeckoId: "avalanche-2",
      chainId: 43114,
      icon: "/icons/networks/avalanche.png",
      availableBridges: {
        token: [56],
      },
      addresses: {
        hatchy: "0x502580fc390606b47FC3b741d6D49909383c28a9",
        lpToken: "0x1273227C0d368A65Eb7942Fa02EF68dbDa466A26",
        usdt: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
        tokenSale: "0xD3E4Be273342a2b15cD575bbcF567dC48baf15B9",
        hatchypocketGen1: "0x76dAAaf7711f0Dc2a34BCA5e13796B7c5D862B53",
        hatchypocketGen1ProxySale: "0x3ee939b0EA957b1F8F931c506f7c4D2ab8147260",
        hatchypocketStakingGen1: "0x4ECD8615858810fA53f1Fed212856Ed973876956",
        hatchypocketGen1BatchTransfer:
          "0x0D1416D28e4555421F0F1C09BEDB8374f098c0e7",

        eggsGen2: "0x956062f3299ADEB15A8676426542e1F0c0E7ca09",
        hatchypocketGen2: "0x7b6121b5B97b9945CE8528f37263bc01cA0B1826",
        hatchypocketStakingGen2: "0xae1BAd89f7cb5615917f685e6AB17BF431052587",
        stakingGen1: "0x4ECD8615858810fA53f1Fed212856Ed973876956",
        stakingGen2: "0xae1BAd89f7cb5615917f685e6AB17BF431052587",
        hatchyReward: "0x71d3a8f9655143d25800750b0ff262Ac70AA40Df",
        hatchyRewardDealer: "0x8f30Ca720285A9138C7894BF8e9295fCedC6867E",
        hatchyLPStake: "0x15B794eB56FE21Ab6AC44C1dB30777dB3E465cE1",
        hatchyLPPair: "0x1273227c0d368a65eb7942fa02ef68dbda466a26",
        hatchySalary: "0x658eE3451118E52f484D2305Fe3fdcC9257f07ae",
        hatchyTickets: "0xcb4A162043D3834aD9706A32b6489599F9bC38E0",
        joepegsTickets: "0xBd2cFf1420389B28C85341F521C5b0cf7B60ec0E",
        mastersItems: "0x958cBb691E5D9f6A99B586995Ee63A61cDc9690a",
        mastersAvatars: "0x47cFa0d9B074Ca01613b7ACC351eFeC41610c11C",
        voucherConverter: "0x8Ccdcb39d7b78B8B5a3135Bf987626209F7d8387",
      },
    },
  ],
  [
    88888888,
    {
      name: "hatchyverse-testnet",
      rpc: 'https://fujirpc.hatchyverse.com/ext/bc/2wbPkbwH9xqoEnX5Lep6SLqLGdiZ1UTQpi7V7fgYNFC1jeWrNg/rpc',
      label: "Hatchyverse Testnet",
      layerzeroId: 10106,
      coingeckoId: "avalanche-2",
      chainId: 88888888,
      icon: "/icons/networks/hatchy.svg",
      availableBridges: {
        token: [],
      },
      addresses: {
        hatchy: "0x84CFc0d9e28a15cA458497ACFaAA075fBbc4F62B",
        hatchyTickets: "0xbbB7f4021e46ECa367F2DC53d6d7FA57632332C8",
        mastersItems: "0xdc3F8938D71531cAB5716685D7896B2549273644",
        mastersAvatars: "0x4E896dA533D73D92a34c7645270Bc07d0c1713A3",
      },
    },
  ],
  [
    56,
    {
      name: "bsc",
      label: "BSC",
      symbol: "BNB",
      rpc: "https://bsc-dataseed.binance.org/",
      nativeCurrency: {
        name: "BNB",
        symbol: "BNB",
        decimals: 18,
      },
      layerzeroId: 102,
      coingeckoId: "binancecoin",
      chainId: 56,
      icon: "/icons/networks/binance-coin.png",
      availableBridges: {
        token: [43114],
      },
      addresses: {
        hatchy: "0x8Af48050534ee9bDe12Ec6e45EA3Db4908c04777",
        eggsGen2: "0x69a211F5891E77c18493c7C72d6BF50E1637a055",
        hatchypocketGen2: "0xc91c80817344c0694f5063FEAB7bb063319A3B21",
        hatchypocketStakingGen2: "0xe7869DA18E6bF1B23276161F02FFb419CBB0CBc5",
        stakingGen2: "0xe7869DA18E6bF1B23276161F02FFb419CBB0CBc5",
        hatchyReward: "0x2092F5Dd755EfFe83A85C4d4c2362a1A0998bDCa",
      },
    },
  ],
]);

const devNetworks: Map<number, NetworkData> = new Map([
  [
    88888888,
    {
      name: "hatchyverse-testnet",
      rpc: 'https://fujirpc.hatchyverse.com/ext/bc/2wbPkbwH9xqoEnX5Lep6SLqLGdiZ1UTQpi7V7fgYNFC1jeWrNg/rpc',
      label: "Hatchyverse Testnet",
      layerzeroId: 10106,
      coingeckoId: "avalanche-2",
      chainId: 88888888,
      icon: "/icons/networks/hatchy.svg",
      availableBridges: {
        token: [],
      },
      addresses: {
        hatchy: "0x84CFc0d9e28a15cA458497ACFaAA075fBbc4F62B",
        hatchyTickets: "0xbbB7f4021e46ECa367F2DC53d6d7FA57632332C8",
        mastersItems: "0xdc3F8938D71531cAB5716685D7896B2549273644",
        mastersAvatars: "0x4E896dA533D73D92a34c7645270Bc07d0c1713A3",
      },
    },
  ],
  [
    43113,
    {
      name: "fuji",
      rpc: 'https://api.avax-test.network/ext/bc/C/rpc',
      label: "Fuji Testnet",
      layerzeroId: 10106,
      coingeckoId: "avalanche-2",
      chainId: 43113,
      icon: "/icons/networks/avalanche.png",
      availableBridges: {
        token: [97, 80001, 4002, 421613],
        omnigens: [4002],
        omnigensItems: [4002],
      },
      addresses: {
        hatchy: "0xcC0a777a0418607d9b8aFC27A59E4eaEDff304fE",
        usdt: "0x82DCEC6aa3c8BFE2C96d40d8805EE0dA15708643",
        omnigens: "0x7fC9af7d339544e91B0c346B30e113ab93A7551B",
        omnigensItems: "0x72229f86329f6CbA0f06b5008Df00D76338b4a1e",
        hatchypocketGen1: "0xDB1fA6B97Ad6b9a83a0D606eDA91F5FEEDe49Be7",
        hatchypocketGen1ProxySale: "0x4D95a743296F33b46A7fb29f261A181E96129451",
        hatchypocketStakingGen1: "0x97B93A64E86c5B47c0d17295B21f01f40e05423b",
        hatchypocketGen1BatchTransfer:
          "0x5ACA59118e6a6C7d508b6fa929Da77C08b88577e",
        eggsGen2: "0xf3B7C0E72cDB2DAf60272E7947A39Cd8c349e9e1",
        hatchypocketGen2: "0x747AF5b06E54061c6e1F8d4F480b693C184Bc5a4",
        hatchypocketStakingGen2: "0x1e759de28dCB129bEF4f7ae7AC32a57D8d65a68A",
        stakingGen1: "0x97B93A64E86c5B47c0d17295B21f01f40e05423b",
        stakingGen2: "0x1e759de28dCB129bEF4f7ae7AC32a57D8d65a68A",
        hatchyReward: "0xFFd17b1f5e118E36EbED2190A178c5f05405AC3e",
        hatchyRewardDealer: "0xAb467b77F2bFc651fF3a73bF95D92d3936d7d79c",
        mastersItems: "0x2E840b673939a1C99390e246AE80257c17Fbb832",
        mastersAvatars: "0x2F0399017C3Be5D874309013A38A73cb661feA6F",
        hatchySalary: "0xAaCc9888424d805Ba6Cf80e318B9494eCd6BCF32",
        hatchyTickets: "0x79C75903558ab6Be1aFA48103c33D0a24464c78E",
        joepegsTickets: "0xbe68d2e50326571ee2399e7d87804c7d47abefaf",
        voucherConverter: "0x00BA147F9FefB92D8FC78586f0304209170f62D4",
      },
    },
  ],
  [
    97,
    {
      name: "bsc-testnet",
      label: "BSC Testnet",
      layerzeroId: 10102,
      coingeckoId: "binancecoin",
      chainId: 97,
      icon: "/icons/networks/binance-coin.png",
      symbol: "BNB",
      rpc: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      nativeCurrency: {
        name: "BNB",
        symbol: "BNB",
        decimals: 18,
      },
      availableBridges: {
        token: [43113, 80001, 4002],
      },
      addresses: {
        hatchy: "0x9cA2AF043C3665bE989615fe7fa0280211059743",
      },
    },
  ],
  [
    4002,
    {
      name: "fantom-testnet",
      label: "Fantom Testnet",
      layerzeroId: 10112,
      coingeckoId: "fantom",
      chainId: 4002,
      symbol: "FTM",
      rpc: "https://rpc.testnet.fantom.network",
      nativeCurrency: {
        name: "FTM",
        symbol: "FTM",
        decimals: 18,
      },
      icon: "/icons/networks/fantom.png",
      availableBridges: {
        token: [97, 43113, 80001, 421613],
        omnigens: [43113],
        omnigensItems: [43113],
      },
      addresses: {
        hatchy: "0x1ea04baf411A4b66ce3C03689C8d95ea7CD4b151",
        omnigens: "0x87dA7b0153e41AEFc5f3A002E898eBFeC45A5742",
        omnigensItems: "0xF0879A585Eaf5e2026E6Ac3306d189f13c77247F",
      },
    },
  ],
  [
    80001,
    {
      name: "mumbai",
      label: "Mumbai Testnet",
      layerzeroId: 10109,
      coingeckoId: "polygon",
      chainId: 80001,
      symbol: "MATIC",
      rpc: "https://rpc-mumbai.matic.today",
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18,
      },
      icon: "/icons/networks/mumbai.png",
      availableBridges: {
        token: [43113, 4002],
      },
      addresses: {
        hatchy: "0x8Af48050534ee9bDe12Ec6e45EA3Db4908c04777",
      },
    },
  ],
]);

export const Networks = config.NODE_ENV == "dev" ? devNetworks : prodNetworks;
const AllNetworks = new Map([...prodNetworks, ...devNetworks]);
export const NetworksArray = Array.from(Networks.values());

export const getAddress = (
  contractName: ContractName,
  chainId: number | undefined = DefaultChainId
) => {
  const networkData = Networks.get(chainId);
  if (!networkData) {
    console.log(`Network ${chainId} is not supported`);
    return;
  }
  const address = networkData.addresses[contractName];
  if (!address) {
    //console.error(`Contract ${contractName} is not deployed on ${chainId}`);
    return;
  }
  return address;
};

export const getContract = (
  contractName: ContractName,
  chainId?: number,
  signer?: boolean
) => {
  const _chainId = chainId || DefaultChainId;
  const provider = getProvider(_chainId);
  if (signer) {
    const contract = new ethers.Contract(
      getAddress(contractName, chainId),
      ABI[contractName],
      getSigner(_chainId)
    );
    return contract;
  } else {
    const contract = new ethers.Contract(
      getAddress(contractName, chainId),
      ABI[contractName],
      provider
    );
    return contract;
  }
}

export const getProvider = (chainId?: number) => {
  const _chainId = chainId || DefaultChainId;
  const networkData = Networks.get(_chainId);
  if (!networkData) {
    console.log(`Network ${_chainId} is not supported`);
    return;
  }
  const provider = new ethers.providers.JsonRpcProvider(
    networkData.rpc
  );
  return provider;
}

export const getAnyProvider = (chainId?: number) => {
  const _chainId = chainId || DefaultChainId;
  const networkData = AllNetworks.get(_chainId);
  const provider = new ethers.providers.JsonRpcProvider(
    networkData.rpc
  );
  return provider;
}

export const getSigner = (chainId?: number) => {
  const _chainId = chainId || DefaultChainId;
  const provider = getProvider(_chainId);
  const signer = new Wallet(config.MASTERS_SIGNER_KEY, provider);
  return signer;
}