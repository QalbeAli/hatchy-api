import { Request, Response, NextFunction } from 'express';
import { admin } from '../firebase/firebase';
import { AuthorizedRequest } from '../types';

interface DecodedIdToken {
  uid: string;
  [key: string]: any;
}

export const authMiddleware = async (req: AuthorizedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Unauthorized');
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken: DecodedIdToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send('Unauthorized');
  }
};