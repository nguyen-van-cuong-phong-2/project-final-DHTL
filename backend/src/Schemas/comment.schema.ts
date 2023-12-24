import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop({ required: true, unique: true, index: true })
  id: number;

  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  news_id: number;

  @Prop({ required: true })
  created_at: number;

  @Prop({ required: true })
  content: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
