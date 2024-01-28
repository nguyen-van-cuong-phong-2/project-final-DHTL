import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TinController } from './stories.controller';
import { TinService } from './stories.service';
import { Middleware } from 'src/middleware/middleware.middleware';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { StoriesSchema, Stories } from 'src/Schemas/stories.schema';
import { FriendModule } from '../Friend/friend.module';
import { UserModule } from '../User/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Stories.name, schema: StoriesSchema }]),
    JwtModule.register({
      secret: 'reqr2141!@321321*!!@$%',
      signOptions: { expiresIn: '1d' },
    }),
    FriendModule,
    UserModule,
  ],
  controllers: [TinController],
  providers: [TinService],
})
export class TinModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Middleware).forRoutes('Stories');
  }
}
