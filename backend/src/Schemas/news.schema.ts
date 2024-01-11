/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type NewsDocument = HydratedDocument<News>;
@Schema()
export class News {
    @Prop({ required: true, unique: true, index: true })
    id: number;

    @Prop({ required: true })
    userId: number;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    created_at: number;

    @Prop({ required: true })
    updated_at: number;

    @Prop()
    image: [string];

    @Prop({ required: true })
    type_seen: number;

    @Prop({ default: 0 })
    share: number;

    @Prop({ default: 0 })
    id_user_be_shared: number;

    @Prop({ default: null })
    name_user_be_shared: string;
}

export const NewsSchema = SchemaFactory.createForClass(News);
