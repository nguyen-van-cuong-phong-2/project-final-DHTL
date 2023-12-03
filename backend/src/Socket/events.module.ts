import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { MessageService } from '../module/Message/message.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '../Schemas/message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  providers: [EventsGateway, MessageService],
})
export class EventsModule {}
