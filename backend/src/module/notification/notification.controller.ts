/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Controller, Post, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';

interface UserPayload {
  id: string;
}

interface ExtendedRequest extends Request {
  user?: UserPayload;
}

@Controller('notification')
export class NotificationController {
  constructor(private readonly NotificationService: NotificationService) {}
  @Post('getNotification')
  async getNotification(@Req() req: ExtendedRequest): Promise<object> {
    if (req.user && req.user.id) {
      const response = await this.NotificationService.getNotification(
        Number(req.user.id),
      );
      return {
        status: 200,
        result: true,
        data: response,
      };
    } else {
      throw new BadRequestException('User không tồn tại');
    }
  }
}
