/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class createNews {
    @IsNumber()
    @IsNotEmpty()
    news_id: string;

    @IsNotEmpty()
    @IsString()
    content: number;

    @IsOptional()
    parent_id: number;
}
