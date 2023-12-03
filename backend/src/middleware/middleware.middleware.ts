import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  userId: string;
}

interface ExtendedRequest extends Request {
  user?: UserPayload;
}

@Injectable()
export class Middleware implements NestMiddleware {
  use(req: ExtendedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    next();
    // if (token) {
    //   return jwt.verify(token, 'reqr2141!@321321*!!@$%', (err, user) => {
    //     if (err) {
    //       return res.status(400).json({ message: 'Invalid token' });
    //     }
    //     req.user = user as UserPayload;
    //     next();
    //   });
    // }
    // return res.status(401).json({ message: 'Missing token' });
  }
}
