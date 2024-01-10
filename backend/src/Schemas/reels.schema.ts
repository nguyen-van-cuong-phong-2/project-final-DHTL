/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type ReelsDocument = HydratedDocument<Reels>;
@Schema()
export class Reels {
  @Prop({ required: true, unique: true, index: true })
  id: number;

  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  video: string;

  @Prop({ required: true })
  created_at: number;
}

export const ReelsSchema = SchemaFactory.createForClass(Reels);
