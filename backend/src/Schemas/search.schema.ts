import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type SearchDocument = HydratedDocument<Search>;
@Schema()
export class Search {
  @Prop({ required: true, unique: true, index: true })
  id: number;

  @Prop({ required: true })
  user_id: number;

  @Prop({ required: true })
  userSearch: Array<number>;
}

export const SearchSchema = SchemaFactory.createForClass(Search);
