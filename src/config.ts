import path from 'path'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'
import AWS from 'aws-sdk'
import serviceAccountDev from "./firebase/hatchyverse-dev-firebase-adminsdk-wqe5t-94dbebf7ed.json";
import serviceAccountProd from "./firebase/hatchyverse-firebase-adminsdk-ufsda-5f941e6194.json";
const env = dotenv.config({ path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`) })
dotenvExpand.expand(env)
const node_env = process.env.NODE_ENV || 'dev'
AWS.config.update({ region: 'us-east-1' });


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

const variables = {
  dev: {
    USER_POOL_ID: 'us-east-1_qhrZoCwXw'
  },
  prod: {
    USER_POOL_ID: 'us-east-1_GtYY0sKtT'
  }
}

const rpc = {
  dev: 'https://api.avax-test.network/ext/bc/C/rpc',
  prod: 'https://api.avax.network/ext/bc/C/rpc'
}

interface ENV {
  NODE_ENV: string | undefined
  WEBSITE: string | undefined
  HATCHY_API: string | undefined
  API_KEY: string | undefined
  ADMIN_KEY: string | undefined
  DB_HOST: string | undefined
  DB_USER: string | undefined
  DB_PASSWORD: string | undefined
  DB_NAME: string | undefined
  FIREBASE_API_KEY: object
  HATCHY_ADDRESS: string | undefined
  HATCHY_TICKETS_ADDRESS: string | undefined
  MASTERS_ITEMS_ADDRESS: string | undefined
  MASTERS_PFP_ADDRESS: string | undefined
  JSON_RPC_URL: string | undefined
  MASTERS_SIGNER_KEY: string | undefined
  IMAGE_API_KEY: string | undefined
  RANDOM_SEED: string | undefined
  HATCHYPOCKET_BUCKET_NAME: string | undefined
  USERS_TABLE: string | undefined
  USER_POOL_ID: string | undefined
  GAMES_SAVES_TABLE: string | undefined
}

const getConfig = (): ENV => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    ADMIN_KEY: process.env.ADMIN_KEY,
    WEBSITE: (process.env.NODE_ENV === 'dev') ?
      'https://dev.hatchyverse.com' :
      'https://hatchyverse.com',
    HATCHY_API: (process.env.NODE_ENV === 'dev') ?
      'https://r69sr7aill.execute-api.us-east-1.amazonaws.com' :
      'https://8dfvuybry3.execute-api.us-east-1.amazonaws.com',
    FIREBASE_API_KEY: (process.env.NODE_ENV === 'dev') ?
      serviceAccountDev : serviceAccountProd,
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
    RANDOM_SEED: process.env.RANDOM_SEED,
    HATCHYPOCKET_BUCKET_NAME: process.env.HATCHYPOCKET_BUCKET_NAME,
    USERS_TABLE: process.env.USERS_TABLE,
    USER_POOL_ID: variables[process.env.NODE_ENV || 'dev']['USER_POOL_ID'],
    GAMES_SAVES_TABLE: process.env.GAMES_SAVES_TABLE
  }
}

const config = getConfig()

export default config