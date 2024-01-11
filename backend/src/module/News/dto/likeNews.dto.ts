/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import { IsNotEmpty, IsNumber } from 'class-validator';
export class likeNews {
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsNumber()
    @IsNotEmpty()
    news_id: number;

    @IsNumber()
    @IsNotEmpty()
    created_at: number;

    @IsNumber()
    @IsNotEmpty()
    type: number;

    @IsNumber()
    @IsNotEmpty()
    comment_id: number;
}
