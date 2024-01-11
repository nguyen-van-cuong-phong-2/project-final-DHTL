/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Post,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { FriendService } from '../Friend/friend.service';

interface UserPayload {
  id: string;
}

interface ExtendedRequest extends Request {
  user?: UserPayload;
}

@Controller('message')
export class MessageController {

  constructor(private readonly mesageService: MessageService,
    private readonly friendService: FriendService
  ) { }

  // lấy danh sách cuộc trò chuyện
  @Post('getMessage')
  @UsePipes(new ValidationPipe())
  async getMessage(
    @Request() req: ExtendedRequest,
  ): Promise<object> {
    try {
      if (req.user && req.user.id) {
        const list_friend = await this.friendService.getListFriend(Number(req.user.id));
        const response = await this.mesageService.getChat(Number(req.user.id), list_friend)
        return {
          status: 200,
          result: true,
          data: response
        }
      }
      throw new ForbiddenException('Không có quyền truy cập');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
