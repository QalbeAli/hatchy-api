import * as express from "express";
import * as jwt from "jsonwebtoken";
import { admin } from "./firebase/firebase";

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  if (securityName === "api_key") {
    let token;
    if (request.query && request.query.access_token) {
      token = request.query.access_token;
    }

    if (token === "abc123456") {
      return Promise.resolve({
        id: 1,
        name: "Ironman",
      });
    } else {
      return Promise.reject({});
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
