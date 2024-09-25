import { CognitoIdentityServiceProvider } from "aws-sdk";
import { getUsername } from "../utils";
import { APIGatewayEvent } from "aws-lambda";

export const roleGroups = [
  {
    groupName: 'admins',
    role: 'admin'
  },
  {
    groupName: 'asset-managers',
    role: 'asset-manager'
  },
  {
    groupName: 'users',
    role: 'user'
  }
];

const getRoles = async (username: string) => {
  try {
    const cognito = new CognitoIdentityServiceProvider();
    const params = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: username
    };
    const response = await cognito.adminListGroupsForUser(params).promise();
    console.log(response);

    const roles = response.Groups.map(cognitoGroup => {
      const group = roleGroups.find(roleGroup => roleGroup.groupName === cognitoGroup.GroupName);
      return group ? group.role : null;
    }).filter(role => role !== null);
    roles.push('user');
    console.log(roles);
    return roles;
  } catch (error) {
    console.log(error);
    return ['user'];
  }
}

const isAssetManager = async (event: APIGatewayEvent) => {
  const username = await getUsername(event);
  const roles = await getRoles(username);
  return roles.includes('asset-manager') || roles.includes('admin');
}

const isAdmin = async (event: APIGatewayEvent) => {
  const username = await getUsername(event);
  console.log(username);

  const roles = await getRoles(username);
  console.log(roles);
  return roles.includes('admin');
}

export default {
  getRoles,
  isAssetManager,
  isAdmin
}