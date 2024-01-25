import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VideoCall } from 'src/Schemas/videoCall.schema';

@Injectable()
export class VideoCallService {
  constructor(
    @InjectModel(VideoCall.name) private videoCall: Model<VideoCall>,
  ) {}

  // tạo cuộc gọi
  public async CreateVideoCall(
    id: number,
    sender_id: number,
    receiver_id: number,
  ): Promise<void> {
    try {
      await this.videoCall.create({
        id,
        sender_id,
        receiver_id,
        created_at: new Date().getTime(),
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // end cuộc gọi
  public async EndVideoCall(
    sender_id: number,
    receiver_id: number,
  ): Promise<void> {
    try {
      await this.videoCall.findOneAndUpdate(
        {
          sender_id,
          receiver_id,
          isCalling: 1,
        },
        { isCalling: 0 },
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Kiểm tra người dùng có đang trong cuộc gọi nào không
  public async CheckUserCall(id: number): Promise<boolean> {
    try {
      const response = await this.videoCall.findOne({
        $or: [{ sender_id: id }, { receiver_id: id }],
        isCalling: 1,
      });
      return response ? true : false;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // lấy id lớn nhất
  public async GetMaxID(): Promise<number> {
    try {
      const response = await this.videoCall
        .findOne({}, { id: 1 })
        .sort({ id: -1 })
        .lean();
      if (response) {
        return response.id + 1;
      } else {
        return 1;
      }
    } catch (error) {
      throw new BadRequestException('Bad request');
    }
  }
}
