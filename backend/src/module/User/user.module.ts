import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Users, UserSchema } from 'src/Schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Middleware } from 'src/middleware/middleware.middleware';
import { JwtModule } from '@nestjs/jwt';
import { Friend, FriendSchema } from 'src/Schemas/friend.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Users.name, schema: UserSchema },
      {
        name: Friend.name,
        schema: FriendSchema,
      },
    ]),
    JwtModule.register({
      secret: 'reqr2141!@321321*!!@$%',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(Middleware)
      .forRoutes(
        { path: '/user/uploadAvatar', method: RequestMethod.POST },
        { path: '/user/SearchUser', method: RequestMethod.POST },
        { path: '/user/getInforUser', method: RequestMethod.POST },
      );
  }
}
