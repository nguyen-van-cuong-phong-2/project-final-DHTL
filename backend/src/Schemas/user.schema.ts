import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type UsersDocument = HydratedDocument<Users>;
@Schema()
export class Users {
  @Prop({ required: true, unique: true, index: true })
  id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  created_at: number;

  @Prop({ default: null })
  avatar: string;

  @Prop({ default: null })
  coverImage: string;

  @Prop({ required: true })
  birthDay: number;

  @Prop({ default: 0 })
  lastLogin: number;
}

export const UserSchema = SchemaFactory.createForClass(Users);
