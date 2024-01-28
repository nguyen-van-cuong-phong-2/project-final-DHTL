import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type StoriesDocument = HydratedDocument<Stories>;
@Schema()
export class Stories {
  @Prop({ required: true, unique: true, index: true })
  id: number;

  @Prop({ required: true })
  user_id: number;

  @Prop({ default: null })
  image: string;

  @Prop({ default: null })
  video: string;

  @Prop({ required: true })
  created_at: number;

  @Prop({ default: null })
  user_seen: Array<number>;
}

export const StoriesSchema = SchemaFactory.createForClass(Stories);
