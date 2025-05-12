import * as express from "express";
import { admin } from "./firebase/firebase";
import config from "./config";
import { User } from "./modules/users/user";
import { UnauthorizedError } from "./errors/unauthorized-error";

async function getUser(uid: string): Promise<User> {
  const userCollection = admin.firestore().collection('users');
  const user = (await userCollection.doc(uid).get()).data();
  return user as User;
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
