/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GroupChatDocument = HydratedDocument<GroupChat>;

@Schema()
export class GroupChat {
    @Prop({ required: true, unique: true, index: true })
    id: number;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    avatar: string;

    @Prop({ required: true })
    created_at: number;

    @Prop({ required: true })
    list_user: [{ id: number }];
}

export const GroupChatSchema = SchemaFactory.createForClass(GroupChat);