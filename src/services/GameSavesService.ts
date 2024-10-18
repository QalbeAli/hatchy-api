import { DynamoDB } from "aws-sdk";
import config from "../config";
const dynamoDB = new DynamoDB.DocumentClient();
export class GameSavesService {

  async gameSaveExists(saveId: string, username: string) {
    const searchGameSave = {
      TableName: config.GAMES_SAVES_TABLE,
      KeyConditionExpression: "#saveId = :saveIdVal",
      FilterExpression: "#username = :usernameVal",
      ExpressionAttributeNames: {
        "#saveId": "saveId",
        "#username": "username"
      },
      ExpressionAttributeValues: {
        ":saveIdVal": saveId,
        ":usernameVal": username
      }
    };
    const resultGameSave = await dynamoDB.query(searchGameSave).promise();
    const gameSaves = resultGameSave.Items;
    return gameSaves.length > 0;
  }

  async consumeCurrency(saveId: string, currency: string, amount: number) {
    const params = {
      TableName: config.GAMES_SAVES_TABLE,
      Key: {
        saveId
      },
      UpdateExpression: "SET #currency = #currency - :amount",
      ExpressionAttributeNames: {
        "#currency": currency
      },
      ExpressionAttributeValues: {
        ":amount": amount
      },
      ReturnValues: 'ALL_NEW',
    };
    await dynamoDB.update(params).promise();
  }
}