import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { Response } from "express";
import * as crypto from 'crypto';
import { ethers } from 'ethers';
import { ApiKeysService } from './services/ApiKeysService';

export const setAvatarLayer = (
  layers: Map<number, any>, order: number, image?: string, mask?: string
) => {
  layers.set(order, {
    image,
    mask
  });
}

export const generateSecureNonce = () => {
  return ethers.BigNumber.from(ethers.utils.randomBytes(32))
}

export const isValidAPIKey = async (apiKey: string, clientId: string, service: string) => {
  const apiKeysService = new ApiKeysService();
  const keyData = await apiKeysService.getApiKeyById(clientId);
  const hashedKey = hashKey(apiKey);
  console.log(keyData, hashedKey, service);
  if (keyData && keyData.apiKey === hashedKey &&
    keyData.service.split(',').includes(service)) {
    return {
      key: keyData,
      valid: true
    }
  }
  return {
    key: null,
    valid: false
  }
}

export const getGen2ShinyIds = (firstGen2Id: number) => {
  const arr: number[] = [];
  for (let i = firstGen2Id; i < 143; i++) {
    const id = (i).toString() + '888';
    arr.push(parseInt(id));
  }
  return arr;
}
export const createRangeArray = (start: number, end: number) => {
  const arr = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
}

export const createArrayOf = (length: number, value: string) => {
  return Array.from({ length }, () => value)
}

export const hashKey = (key: string) => {
  return crypto.createHash('sha256').update(key).digest('hex')
}

export const getNonce = (data: string) => {
  const nonce = Math.floor(Math.random() * 1000000).toString();
  const date = new Date().getTime();
  const hash = crypto.createHash('sha256');
  hash.update(nonce + date + data);
  const hashed = hash.digest('hex');
  return hashed;
}

export const getEmailVerifySignup = (url: string) => {
  const content = `
  <html>
      <head>
          <style>
          .main-board {
              padding-left: 100px;
              padding-right: 100px;  			
          }
          /* Use a media query to add a breakpoint at 800px: */
          @media screen and (max-width: 800px) {
              .main-board {
                      padding-left: 30px;
                  padding-right: 30px;
              }
          }
          </style>
      </head>
      <body>
          <div class="main-board" style="display: block;padding-top: 50px;padding-bottom: 100px; font-size: 16px">
              <div>Hey Summoner!,🧙‍♂️👾</div>
              <span>Thanks for subscibing to our mailing list! ♥</span>
              <div style="margin-top: 16px">We're only one step away now, click below to officially confirm your subscription!</div>
              <div style="margin-top: 20px;">
                  <a style="text-decoration: none; padding: 8px 20px; border-radius: 3px; background-color: #319b19; color: #ffffff; font-weight: 600;" href="${url}">
                      VERIFY
                  </a>
              </div>
              <div style="margin-top: 16px">
                  <a style="text-decoration: none; word-break: break-all;" href="${url}">
                  ${url}
                  </a>
              </div>
              <div style="margin-top: 60px;font-weight:600">The Hatchyverse Support Team</div>
          </div>
      </body>
  </html>`;

  return content;
}

export const getEmailConfirmationCode = (code: number) => {
  const content = `
  <html>
  <head>
    <style>
      .main-board {
        padding-left: 100px;
        padding-right: 100px;
      }
  
      /* Use a media query to add a breakpoint at 800px: */
      @media screen and (max-width: 800px) {
        .main-board {
          padding-left: 30px;
          padding-right: 30px;
        }
      }
    </style>
  </head>
  <body>
    <div class="main-board" style="display: block;padding-top: 50px;padding-bottom: 100px; font-size: 16px">
      <div>Hey Master!,🧙‍♂️👾</div>
      <span>One last step to start using your account!</span>
      <div style="margin-top: 16px">Enter the following code in the website to confirm your account:</div>
      <div style="margin-top: 20px; font: bold; font-size: xx-large; font-weight: bold;">
        ${code}
      </div>
      <a href="https://hatchyverse.com/" target="_blank" style="margin-top: 16px">https://hatchyverse.com/</a>
      <div style="margin-top: 30px;font-weight:600">The Hatchyverse Support Team</div>
    </div>
  </body>
  
  </html>`;
  return content;
}

export const messageResponse = (res: Response, code = 400, message?: string) => {
  if (!message && code == 500) {
    message = "Internal server error";
  }
  return res.status(code).json({ message });
}

export const getUsername = async (event: any) => {
  const username =
    event.requestContext.authorizer.jwt.claims['cognito:username'] ||
    event.requestContext.authorizer.jwt.claims['username'];
  const mainAccount = await getMainAccount(username);
  return mainAccount ? mainAccount.username : username;
}

export const getMainAccount = async (username: any) => {
  try {
    const cognito = new CognitoIdentityServiceProvider();
    const params = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: username
    };
    const response = await cognito.adminGetUser(params).promise();
    // console.log(response);
    const mainUsernameAttribute = response.UserAttributes.find(attribute => attribute.Name === 'custom:mainUsername');
    // console.log("mainUsername:", mainUsernameAttribute);
    if (mainUsernameAttribute == null || mainUsernameAttribute.Value === '') {
      return null;
    }
    // get email of main account
    const paramsMain = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: mainUsernameAttribute.Value
    };
    const responseMain = await cognito.adminGetUser(paramsMain).promise();
    const emailAttribute = responseMain.UserAttributes.find(attribute => attribute.Name === 'email');
    return {
      username: mainUsernameAttribute.Value,
      email: emailAttribute ? emailAttribute.Value : null
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const getEmail = (event: any) => {
  const email = event.requestContext.authorizer.jwt.claims.email;
  return email;
}

export const isAdmin = async (username: string) => {
  try {
    const cognito = new CognitoIdentityServiceProvider();
    const params = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: username
    };
    const response = await cognito.adminListGroupsForUser(params).promise();
    console.log(response);

    for (let group of response.Groups) {
      if (group.GroupName === 'admins') {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const isValidBotAPIKey = (event: any) => {
  if (!event.headers || event.headers['authorization'] === undefined || event.headers['authorization'] === null) {
    return false;
  }
  const apiKey = event.headers['authorization'].split(' ')[1];
  return apiKey === process.env.BOT_API_KEY;
}

export const mapGameSave = (gameSave: any) => {
  const data = JSON.parse(JSON.stringify(gameSave));
  delete data.saveName;
  delete data.saveId;
  delete data.username;
  delete data.gameId;
  delete data.date;
  return {
    saveName: gameSave.saveName,
    saveId: gameSave.saveId,
    username: gameSave.username,
    gameId: gameSave.gameId,
    date: gameSave.date,
    data
  }
}

export const isEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}