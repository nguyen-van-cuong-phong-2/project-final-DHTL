import { IsNotEmpty, IsNumber } from 'class-validator';
export class makeFriends {
  @IsNumber()
  sender_id: number;

  @IsNumber()
  @IsNotEmpty()
  readonly receiver_id: number;

  @IsNumber()
  id: number;

  @IsNumber()
  created_at: number;
}
