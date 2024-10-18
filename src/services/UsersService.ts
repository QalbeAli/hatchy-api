import { CognitoIdentityServiceProvider, DynamoDB } from "aws-sdk";
import { User } from "../models/user";
import config from "../config";
const dynamoDB = new DynamoDB.DocumentClient();
const cognito = new CognitoIdentityServiceProvider();

const getUserById = async (id: string) => {
  const searchUserExists = {
    TableName: config.USERS_TABLE,
    Key: {
      address: id
    }
  };
  const result = await dynamoDB.get(searchUserExists).promise();
  return result.Item as User | null;
};

const updateUser = async (user: User) => {
  const params = {
    TableName: config.USERS_TABLE,
    Item: user,
    ReturnValues: 'ALL_OLD',
  };
  await dynamoDB.put(params).promise();
}

const setRewardReceiverAddress = async (username: string, address: string) => {
  const params = {
    TableName: config.USERS_TABLE,
    Key: { address: username },
    UpdateExpression: "set rewardReceiverAddress = :rewardReceiverAddress",
    ExpressionAttributeValues: {
      ":rewardReceiverAddress": address
    },
    ReturnValues: "ALL_NEW"
  };
  await dynamoDB.update(params).promise();
}

const getCognitoUserByUsername = async (username: string) => {
  try {
    const paramsCognito = {
      UserPoolId: config.USER_POOL_ID,
      Username: username
    };
    const user = await cognito.adminGetUser(paramsCognito).promise()
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const getCognitoGoogleUserByEmail = async (email: string) => {
  const paramsCognito = {
    UserPoolId: config.USER_POOL_ID,
    Filter: `email = "${email}"`,
  };
  const users = await cognito.listUsers(paramsCognito).promise();
  const user = users.Users?.find(user => user.Username.includes('Google_'));
  return user;
}

const confirmUser = async (id: string) => {
  const paramsCognito = {
    UserPoolId: config.USER_POOL_ID,
    Username: id,
  };
  await cognito.adminConfirmSignUp(paramsCognito).promise();
}

const linkToExistingUser = async (username: string, mainUsername: string) => {
  const params = {
    UserAttributes: [
      {
        Name: 'custom:mainUsername',
        Value: mainUsername
      },
    ],
    UserPoolId: config.USER_POOL_ID,
    Username: username,
  };
  await cognito.adminUpdateUserAttributes(params).promise();
}

export default {
  getUserById,
  updateUser,
  getCognitoUserByUsername,
  getCognitoGoogleUserByEmail,
  confirmUser,
  linkToExistingUser,
  setRewardReceiverAddress
}