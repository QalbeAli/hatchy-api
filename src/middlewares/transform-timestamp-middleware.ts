import { Request, Response, NextFunction } from "express";
import { Timestamp } from 'firebase/firestore';

export function transformTimestampMiddleware(req: Request, response: Response, next: NextFunction) {
  const originalSend = response.send;

  response.send = function (body: any) {
    // validate if body is a valid JSON
    const contentType = response.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      return originalSend.call(this, body);
    }
    if (body) {
      body = JSON.parse(body);
      body = convertTimestampsToStrings(body);
      body = JSON.stringify(body);
    }
    return originalSend.call(this, body);
  };
  next();
}

function convertTimestampsToStrings(data: any): any {
  if (isFirestoreTimestamp(data)) {
    const firestoreTimestamp = new Timestamp(data["_seconds"], data["_nanoseconds"]);
    return firestoreTimestamp.toDate().toISOString();
  } else if (Array.isArray(data)) {
    return data.map(item => convertTimestampsToStrings(item));
  } else if (typeof data === 'object' && data !== null) {
    const convertedData: { [key: string]: any } = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        convertedData[key] = convertTimestampsToStrings(data[key]);
      }
    }
    return convertedData;
  } else {
    return data;
  }
}

function isFirestoreTimestamp(obj: any): boolean {
  return obj && typeof obj === 'object' && '_seconds' in obj && '_nanoseconds' in obj;
}