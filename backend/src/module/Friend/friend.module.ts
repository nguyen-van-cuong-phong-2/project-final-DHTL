import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Friend, FriendSchema } from 'src/Schemas/friend.schema';
import { Middleware } from 'src/middleware/middleware.middleware';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Friend.name, schema: FriendSchema }]),
    JwtModule.register({
      secret: 'reqr2141!@321321*!!@$%',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Middleware).forRoutes(
      {
        path: '/friend/sendMakeFriend',
        method: RequestMethod.POST,
      },
      {
        path: '/friend/acceptMakeFriend',
        method: RequestMethod.POST,
      },
      {
        path: '/friend/cancelMakeFriend',
        method: RequestMethod.POST,
      },
    );
  }
}
