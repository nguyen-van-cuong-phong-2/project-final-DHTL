import { IsNotEmpty, IsString } from 'class-validator';
export class Login {
  @IsString()
  @IsNotEmpty()
  readonly userName: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
