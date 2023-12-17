import { BadRequestException, Injectable } from '@nestjs/common';
import { createNotifi } from './dto/createNotifi.dto';
import { Notification } from 'src/Schemas/notification.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private NotificationModel: Model<Notification>,
  ) {}

  // thêm mới thông báo
  public async createNotifi(data: createNotifi): Promise<void> {
    try {
      const check = await this.NotificationModel.findOne({
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        type: 1,
      });

      if (!check) await this.NotificationModel.create(data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // lấy id lớn nhất
  public async GetMaxID(): Promise<number> {
    try {
      const response = await this.NotificationModel.findOne({}, { id: 1 })
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

  // lấy thông báo
  public async getNotification(id: number): Promise<createNotifi[]> {
    try {
      await this.NotificationModel.updateMany(
        { receiver_id: id, seen: 0 },
        { seen: 1 },
      );
      const response = await this.NotificationModel.aggregate([
        { $match: { receiver_id: id } },
        { $sort: { created_at: -1 } },
        { $limit: 50 },
        {
          $lookup: {
            from: 'users',
            localField: 'sender_id',
            foreignField: 'id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
        {
          $project: {
            created_at: 1,
            type: 1,
            link: 1,
            name: '$user.name',
            avatar: '$user.avatar',
          },
        },
      ]);
      for (let i = 0; i < response.length; i++) {
        const element = response[i];
        if (element.avatar)
          element.avatar = `${process.env.DOMAIN}${element.avatar}`;
      }
      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // lấy số lượng thông báo
  public async getTotalNotification(id: number): Promise<number> {
    const number = await this.NotificationModel.countDocuments({
      receiver_id: id,
    });
    return number;
  }
}
