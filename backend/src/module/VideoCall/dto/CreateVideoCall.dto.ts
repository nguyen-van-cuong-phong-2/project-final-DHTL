/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber } from 'class-validator';
export class CreateVideoCall {
    @IsNumber()
    @IsNotEmpty()
    readonly sender_id: number;
    @IsNumber()
    @IsNotEmpty()
    readonly receiver_id: number;
}
