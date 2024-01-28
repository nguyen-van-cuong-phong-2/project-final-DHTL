import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
export class createStories {
  @IsNumber()
  @IsNotEmpty()
  readonly id: number;

  @IsNumber()
  @IsNotEmpty()
  readonly user_id: number;

  @IsOptional()
  readonly image?: string | null;

  @IsOptional()
  readonly video?: string | null;

  @IsNumber()
  @IsNotEmpty()
  readonly created_at: number;
}
