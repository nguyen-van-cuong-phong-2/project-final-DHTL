/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageGroupChatDocument = HydratedDocument<MessageGroupChat>;

@Schema()
export class MessageGroupChat {
    @Prop({ required: true, unique: true, index: true })
    id: number;

    @Prop({ required: true })
    sender_id: number;

    @Prop({ required: true })
    receiver_id: number;

    @Prop({ required: true })
    created_at: number;

    @Prop({ default: [] })
    list_user_seen: [{ id: number }];
}

export const MessageGroupChatSchema = SchemaFactory.createForClass(MessageGroupChat);