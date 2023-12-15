/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import { IsNotEmpty, IsNumber } from 'class-validator';
export class accept {
    @IsNumber()
    @IsNotEmpty()
    readonly id: number;
}
