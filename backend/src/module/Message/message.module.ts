import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Message, MessageSchema } from '../../Schemas/message.schema';
import { FriendModule } from '../Friend/friend.module';
import { Middleware } from 'src/middleware/middleware.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    FriendModule,
    JwtModule.register({
      secret: 'reqr2141!@321321*!!@$%',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService],
})
export class MessageModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Middleware).forRoutes('message');
  }
}
