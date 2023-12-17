import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class createNotifi {
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;

  @IsNumber()
  @IsNotEmpty()
  readonly sender_id: number;

  @IsNumber()
  @IsNotEmpty()
  readonly receiver_id: number;

  @IsNumber()
  @IsNotEmpty()
  readonly created_at: number;

  @IsNumber()
  @IsNotEmpty()
  readonly type: number;

  @IsString()
  @IsNotEmpty()
  readonly link: string;
}
