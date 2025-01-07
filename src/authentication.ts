import * as express from "express";
import { admin } from "./firebase/firebase";
import config from "./config";

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === "api_key") {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return Promise.reject(new Error("No authorization header."));
    }
    const token = authHeader.split('Bearer ')[1];
    if (token === config.API_KEY) {
      return Promise.resolve({});
    } else {
      return Promise.reject(new Error("Invalid API key."));
    }
  }


  if (securityName === "jwt") {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return Promise.reject(new Error("No authorization header."));
    }
    const token = authHeader.split('Bearer ')[1];

    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new Error("No token provided"));
      }
      admin.auth().verifyIdToken(token).then((decoded) => {
        for (let scope of scopes) {
          if (!decoded.scopes.includes(scope)) {
            reject(new Error("JWT does not contain required scope."));
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
