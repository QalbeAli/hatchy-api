import path from 'path'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
const env = dotenv.config({ path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`) })
dotenvExpand.expand(env)

const addressess = {
  dev: {
    'hatchy-address': '0xcC0a777a0418607d9b8aFC27A59E4eaEDff304fE',
    'masters-pfp-address': '0x2F0399017C3Be5D874309013A38A73cb661feA6F',
    'masters-items-address': '0x2E840b673939a1C99390e246AE80257c17Fbb832',
    'hatchy-tickets-address': '0x79C75903558ab6Be1aFA48103c33D0a24464c78E'
  },
  prod: {
    'hatchy-address': '0x502580fc390606b47FC3b741d6D49909383c28a9',
    'masters-pfp-address': '0x47cFa0d9B074Ca01613b7ACC351eFeC41610c11C',
    'masters-items-address': '0x958cBb691E5D9f6A99B586995Ee63A61cDc9690a',
    'hatchy-tickets-address': '0xcb4A162043D3834aD9706A32b6489599F9bC38E0'
  }
}

const rpc = {
  dev: 'https://api.avax-test.network/ext/bc/C/rpc',
  prod: 'https://api.avax.network/ext/bc/C/rpc'
}

interface ENV {
  NODE_ENV: string | undefined
  HATCHY_API: string | undefined
  API_KEY: string | undefined
  DB_HOST: string | undefined
  DB_USER: string | undefined
  DB_PASSWORD: string | undefined
  DB_NAME: string | undefined
  HATCHY_ADDRESS: string | undefined
  HATCHY_TICKETS_ADDRESS: string | undefined
  MASTERS_ITEMS_ADDRESS: string | undefined
  MASTERS_PFP_ADDRESS: string | undefined
  JSON_RPC_URL: string | undefined
  MASTERS_SIGNER_KEY: string | undefined
  IMAGE_API_KEY: string | undefined
  RANDOM_SEED: string | undefined
}

const getConfig = (): ENV => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    HATCHY_API: (process.env.NODE_ENV === 'dev') ?
      'https://r69sr7aill.execute-api.us-east-1.amazonaws.com' :
      'https://8dfvuybry3.execute-api.us-east-1.amazonaws.com',
    API_KEY: process.env.API_KEY,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    HATCHY_ADDRESS: addressess[process.env.NODE_ENV || 'dev']['hatchy-address'],
    HATCHY_TICKETS_ADDRESS: addressess[process.env.NODE_ENV || 'dev']['hatchy-tickets-address'],
    MASTERS_ITEMS_ADDRESS: addressess[process.env.NODE_ENV || 'dev']['masters-items-address'],
    MASTERS_PFP_ADDRESS: addressess[process.env.NODE_ENV || 'dev']['masters-pfp-address'],
    JSON_RPC_URL: rpc[process.env.NODE_ENV || 'dev'],
    MASTERS_SIGNER_KEY: process.env.MASTERS_SIGNER_KEY,
    IMAGE_API_KEY: process.env.IMAGE_API_KEY,
    RANDOM_SEED: process.env.RANDOM_SEED
  }
}

const config = getConfig()

export default config