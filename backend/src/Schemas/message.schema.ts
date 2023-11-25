import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop({ required: true, unique: true })
  _id: number;

  @Prop({ required: true })
  sender_id: number;

  @Prop({ required: true })
  receiver_id: number;

  @Prop({ required: true })
  created_at: number;

  @Prop({ required: true })
  content: string;

  @Prop({ default: 0 })
  seen: number;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
