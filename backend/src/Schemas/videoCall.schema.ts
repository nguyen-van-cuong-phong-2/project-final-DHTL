import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type VideoCallDocument = HydratedDocument<VideoCall>;
@Schema()
export class VideoCall {
  @Prop({ required: true, unique: true, index: true })
  id: number;

  @Prop({ required: true })
  sender_id: number;

  @Prop({ required: true })
  receiver_id: number;

  @Prop({ required: true })
  created_at: number;

  @Prop({ default: 1 })
  isCalling: number;
}

export const VideoCallSchema = SchemaFactory.createForClass(VideoCall);
