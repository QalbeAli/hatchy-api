import * as express from "express";
import { admin } from "./firebase/firebase";
import config from "./config";
import { User } from "./modules/users/user";
import { UnauthorizedError } from "./errors/unauthorized-error";
import { ApiKey } from "./modules/api-keys/api-key";

async function getUser(uid: string): Promise<User> {
  const userCollection = admin.firestore().collection('users');
  const user = (await userCollection.doc(uid).get()).data();
  return user as User;
}

async function getApiKey(apiKey: string): Promise<ApiKey> {
  const apiKeyCollection = admin.firestore().collection('api-keys');
  const apiKeyDoc = await apiKeyCollection.where('apiKey', '==', apiKey).get();
  return apiKeyDoc.docs[0].data() as ApiKey;
}

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === "api_key") {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return Promise.reject(new UnauthorizedError("No authorization header."));
    }
    const token = authHeader.split('Bearer ')[1];
    if (token === config.API_KEY) {
      return Promise.resolve({});
    } else {
      return Promise.reject(new UnauthorizedError("Invalid API key."));
    }
  }

  if (securityName === "api_key_rewards") {
    const apiKeyHeader = request.headers['x-api-key'] as string;
    if (!apiKeyHeader) {
      return Promise.reject(new UnauthorizedError("No authorization header."));
    }
    const key = apiKeyHeader;
    return new Promise((resolve, reject) => {
      if (!key) {
        reject(new UnauthorizedError("No token provided"));
      }
      getApiKey(key).then((apiKey) => {
        if (apiKey.permissions && apiKey.permissions.includes("rewards")) {
          resolve(apiKey);
        }
        reject(new UnauthorizedError("Invalid API key."));
      }).catch((error) => {
        reject(new UnauthorizedError("Invalid API key."));
      });
    });
  }

  if (securityName === "api_key_rank") {
    const apiKeyHeader = request.headers['x-api-key'] as string;
    if (!apiKeyHeader) {
      return Promise.reject(new UnauthorizedError("No authorization header."));
    }
    const key = apiKeyHeader;
    return new Promise((resolve, reject) => {
      if (!key) {
        reject(new UnauthorizedError("No token provided"));
      }
      getApiKey(key).then((apiKey) => {
        if (apiKey.permissions && apiKey.permissions.includes("rank")) {
          if (request.body.appId !== apiKey.appId) {
            reject(new UnauthorizedError("Invalid API key."));
          }
          resolve(apiKey);
        }
        reject(new UnauthorizedError("Invalid API key."));
      }).catch((error) => {
        reject(new UnauthorizedError("Invalid API key."));
      });
    });
  }

  if (securityName === "api_key_scores") {
    const apiKeyHeader = request.headers['x-api-key'] as string;
    if (!apiKeyHeader) {
      return Promise.reject(new UnauthorizedError("No authorization header."));
    }
    const key = apiKeyHeader;
    return new Promise((resolve, reject) => {
      if (!key) {
        reject(new UnauthorizedError("No token provided"));
      }
      getApiKey(key).then((apiKey) => {
        if (apiKey.permissions && apiKey.permissions.includes("scores")) {
          if (request.body.appId !== apiKey.appId) {
            reject(new UnauthorizedError("Invalid API key."));
          }
          resolve(apiKey);
        }
        reject(new UnauthorizedError("Invalid API key."));
      }).catch((error) => {
        reject(new UnauthorizedError("Invalid API key."));
      });
    });
  }

  if (securityName === "jwt") {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return Promise.reject(new UnauthorizedError("No authorization header."));
    }
    const token = authHeader.split('Bearer ')[1];

    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new UnauthorizedError("No token provided"));
      }
      admin.auth().verifyIdToken(token).then(async (decoded) => {
        const user = await getUser(decoded.uid);
        if (scopes && scopes.length > 0) {
          if (!user.roles) {
            reject(new UnauthorizedError("User does not have required scope."));
          }
          if (!user.roles.includes("admin")) {
            for (let scope of scopes) {
              if (!user.roles.includes(scope)) {
                reject(new UnauthorizedError("User does not have required scope."));
              }
            }
          }
        }
        resolve(decoded);
      }).catch((error) => {
        console.log(error);
        reject(error);
      });
    });
  }
}
