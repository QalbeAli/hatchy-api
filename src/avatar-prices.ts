import { ethers } from "ethers";
import config from "./config";

interface AvatarPrice {
  currency: string;
  price: string;
  image: string;
  decimals: number;
  address: string;
}

const prodAvatarPrices: Map<string, AvatarPrice> = new Map([
  /*
  [
    'avax',
    {
      currency: 'avax',
      price: '1',
      image: '/currencies/avax.png',
      decimals: 18,
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
    },
  ],
  [
    'usdt',
    {
      currency: 'usdt',
      price: '1',
      image: '/currencies/usdt.png',
      decimals: 6,
      address: '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7'
    },
  ],
  [
    'hatchy',
    {
      currency: 'hatchy',
      price: '10000',
      image: '/currencies/hatchy.png',
      decimals: 18,
      address: '0x502580fc390606b47FC3b741d6D49909383c28a9'
    },
  ],
  */
]);

const devAvatarPrices: Map<string, AvatarPrice> = new Map([
  [
    'avax',
    {
      currency: 'avax',
      price: '0.1',
      image: '/currencies/avax.png',
      decimals: 18,
      address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
    },
  ],
  [
    'usdt',
    {
      currency: 'usdt',
      price: '0.1',
      image: '/currencies/usdt.png',
      decimals: 6,
      address: '0x82DCEC6aa3c8BFE2C96d40d8805EE0dA15708643'
    },
  ],
  [
    'hatchy',
    {
      currency: 'hatchy',
      price: '100',
      image: '/currencies/hatchy.png',
      decimals: 18,
      address: '0xcC0a777a0418607d9b8aFC27A59E4eaEDff304fE'
    },
  ],
]);

export const AvatarPrices = config.NODE_ENV == "dev" ? devAvatarPrices : prodAvatarPrices;
export const AvatarPricesArray = Array.from(AvatarPrices.values());

export const getAvatarPrice = (
  currency: string
): AvatarPrice | undefined => {
  if (currency === ethers.constants.AddressZero) {
    return {
      currency: 'avax',
      price: '0',
      image: '/currencies/avax.png',
      decimals: 18,
      address: ethers.constants.AddressZero
    }
  }
  const priceData = AvatarPrices.get(currency);
  return priceData;
};