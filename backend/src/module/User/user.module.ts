import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Users, UserSchema } from 'src/Schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Middleware } from 'src/middleware/middleware.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UserSchema }]),
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
    consumer.apply(Middleware).forRoutes('/user/uploadAvatar');
  }
}
