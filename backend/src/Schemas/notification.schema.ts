/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type NotificationDocument = HydratedDocument<Notification>;
@Schema()
export class Notification {
    @Prop({ required: true, unique: true, index: true })
    id: number;

    @Prop({ required: true })
    sender_id: number;

    @Prop({ required: true })
    receiver_id: number;

    @Prop({ required: true })
    created_at: number;

    @Prop({ required: true })
    type: number;

    @Prop({ required: true })
    link: string;

    @Prop({ default: 0 })
    seen: number;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
