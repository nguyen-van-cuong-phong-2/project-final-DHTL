import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { MessageService } from '../module/Message/message.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '../Schemas/message.schema';
import { Users, UserSchema } from '../Schemas/user.schema';
import { UserModule } from 'src/module/User/user.module';
import { Friend, FriendSchema } from 'src/Schemas/friend.schema';
import { NotificationModule } from 'src/module/notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Users.name, schema: UserSchema },
      { name: Friend.name, schema: FriendSchema },
    ]),
    UserModule,
    NotificationModule,
  ],
  providers: [EventsGateway, MessageService],
  exports: [EventsGateway],
})
export class EventsModule {}
