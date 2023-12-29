/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Controller, Req } from '@nestjs/common';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { FriendService } from './friend.service';
import { Friend } from 'src/Schemas/friend.schema';
import {
    Post,
    Body,
    UsePipes,
} from '@nestjs/common';


interface UserPayload {
    id: string;
}

interface ExtendedRequest extends Request {
    user?: UserPayload;
}

@Controller('friend')
export class FriendController {
    constructor(private readonly friendService: FriendService) { }

    // gửi kết bạn
    @Post('sendMakeFriend')
    @UsePipes(new ValidationPipe())
    async SearchUser(@Body() data: { receiver_id: number }, @Req() req: ExtendedRequest): Promise<object> {
        try {
            const id = await this.friendService.GetMaxID();
            const created_at = new Date().getTime();
            const payload = { id, created_at, sender_id: Number(req.user?.id), receiver_id: data.receiver_id };
            const response = await this.friendService.SendMakeFriend(payload);
            return {
                status: 200,
                result: true,
                response
            };
        } catch (error) {
            throw error;
        }
    }

    // đồng ý kết bạn
    @Post('acceptMakeFriend')
    @UsePipes(new ValidationPipe())
    async AcceptMakeFriend(@Body() data: { receiver_id: number }, @Req() req: ExtendedRequest): Promise<object> {
        try {
            if (req.user && req.user?.id) {
                await this.friendService.AcceptMakeFriend(data.receiver_id, Number(req.user?.id));
                return {
                    status: 200,
                    result: true,
                };
            }
            return {
                result: false,
                status: 400
            }
        } catch (error) {
            throw error;
        }
    }

    // huỷ kết bạn
    @Post('cancelMakeFriend')
    @UsePipes(new ValidationPipe())
    async CancelMakeFriend(@Body() data: { receiver_id: number }, @Req() req: ExtendedRequest): Promise<object> {
        try {
            await this.friendService.DeleteMakeFriend(data.receiver_id, Number(req.user?.id));
            return {
                status: 200,
                result: true,
            };
        } catch (error) {
            throw error;
        }
    }

    // danh sách bạn bè online
    @Post('getListFriendOnline')
    @UsePipes(new ValidationPipe())
    async getListFriendOnline(@Body() data: { arr: Array<number> }, @Req() req: ExtendedRequest): Promise<object> {
        try {
            if (req.user && data.arr) {
                const query = await this.friendService.getListFriend(Number(req.user.id));
                const filter = query.filter((item: { id: number; }) => data.arr.includes(item.id));
                return {
                    status: 200,
                    result: true,
                    data: filter,
                }
            }
            throw new BadRequestException()
        } catch (error) {
            throw error;
        }
    }

}
