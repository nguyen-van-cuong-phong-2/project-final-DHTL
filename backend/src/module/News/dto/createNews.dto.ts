/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import { IsNotEmpty, IsString } from 'class-validator';
export class createNews {
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    type_seen: number;
}
