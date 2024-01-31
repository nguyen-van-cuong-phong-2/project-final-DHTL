/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
interface ExtendedRequest extends Request {
  user?: {id: number};
}

@Injectable()
export class Middleware implements NestMiddleware {
  constructor(private jwtService: JwtService) { }
  async use(req: ExtendedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
      try {
        const user = await this.jwtService.verifyAsync(token, {
          secret: process.env.NODE_SERCET,
        });
        req.user = user;
        next();
      } catch (error) {
        throw new UnauthorizedException();
      }
    } else {
      return res.status(401).json({ message: 'Missing token' });
    }
  }
}
