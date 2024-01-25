import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { VideoCallService } from './VideoCall.service';
import { CreateVideoCall } from './dto/CreateVideoCall.dto';

@Controller('VideoCall')
export class VideoCallController {
  constructor(private readonly videoCallService: VideoCallService) {}
  // Kiểm tra người dùng có đang trong cuộc gọi nào không
  @Post('CheckUserCall')
  async GetDataProfile(
    @Body()
    data: {
      id: number;
    },
  ): Promise<object> {
    try {
      const response = await this.videoCallService.CheckUserCall(data.id);
      return {
        result: true,
        status: 200,
        data: response,
      };
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  // tạo cuộc gọi
  @Post('CreateVideoCall')
  @UsePipes(new ValidationPipe())
  async CreateVideoCall(
    @Body()
    data: CreateVideoCall,
  ): Promise<object> {
    try {
      const id = await this.videoCallService.GetMaxID();
      await this.videoCallService.CreateVideoCall(
        id,
        data.sender_id,
        data.receiver_id,
      );
      return {
        result: true,
        status: 200,
      };
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  // end cuộc gọi
  @Post('EndVideoCall')
  @UsePipes(new ValidationPipe())
  async EndVideoCall(
    @Body()
    data: CreateVideoCall,
  ): Promise<void> {
    try {
      await this.videoCallService.EndVideoCall(
        data.sender_id,
        data.receiver_id,
      );
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
