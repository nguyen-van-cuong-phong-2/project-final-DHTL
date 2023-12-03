import { IsNotEmpty, IsString } from 'class-validator';
export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  readonly userName: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsString()
  @IsNotEmpty()
  readonly birthDay: string;
}
