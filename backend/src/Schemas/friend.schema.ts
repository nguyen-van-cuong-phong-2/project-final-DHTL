/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type FriendDocument = HydratedDocument<Friend>;
@Schema()
export class Friend {
    @Prop({ required: true, unique: true, index: true })
    id: number;

    @Prop({ required: true })
    sender_id: number;

    @Prop({ required: true })
    receiver_id: number;

    @Prop({ required: true })
    created_at: number;

    @Prop({ default: 0 })
    status: number;
}

export const FriendSchema = SchemaFactory.createForClass(Friend);
