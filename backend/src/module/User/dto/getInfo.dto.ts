/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber } from 'class-validator';
export class getInfor {
    @IsNumber()
    @IsNotEmpty()
    readonly id: number;
}
