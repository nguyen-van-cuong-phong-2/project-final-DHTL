import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LikeDocument = HydratedDocument<Like>;

@Schema()
export class Like {
  @Prop({ required: true, unique: true, index: true })
  id: number;

  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  news_id: number;

  @Prop({ required: true })
  created_at: number;

  @Prop({ required: true })
  type: number;
}

export const LikeSchema = SchemaFactory.createForClass(Like);
