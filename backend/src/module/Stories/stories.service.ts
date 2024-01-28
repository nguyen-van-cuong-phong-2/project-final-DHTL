import {
  BadRequestException,
  Injectable,
  PayloadTooLargeException,
} from '@nestjs/common';
import { createStories } from './dao/createStories.dao';
import { InjectModel } from '@nestjs/mongoose';
import { Stories } from 'src/Schemas/stories.schema';
import { Model } from 'mongoose';
import * as path from 'path';
import * as fs from 'node:fs';

@Injectable()
export class TinService {
  constructor(
    @InjectModel(Stories.name) private StoriesModel: Model<Stories>,
  ) {}
  // upload stories
  public async uploadStories(data: createStories): Promise<void> {
    try {
      await this.StoriesModel.create(data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // upload file
  public async uploadFile(file: any, time: number, pathFolder: string) {
    try {
      const path1 = `./storage/pictures/${pathFolder}/`;
      const filePath = `./storage/pictures/${pathFolder}/${time}_${file.originalname}`;
      const fileCheck = path.extname(filePath);
      const checkFile = ['.jpg', '.png', '.mp4'];
      if (checkFile.includes(fileCheck.toLocaleLowerCase()) === false) {
        return false;
      }
      if (['.mp4'].includes(fileCheck.toLocaleLowerCase())) {
        const size = file.size / 1000000;
        if (size > 20) {
          throw new PayloadTooLargeException('File quá lớn');
        }
      }
      if (!fs.existsSync(path1)) {
        fs.mkdirSync(path1, { recursive: true });
      }
      fs.writeFileSync(filePath, file.buffer);
      const type = ['.mp4'].includes(fileCheck.toLocaleLowerCase())
        ? true
        : false;
      return {
        link: `/pictures/${pathFolder}/${time}_${file.originalname}`,
        type,
      };
    } catch (error) {
      console.log('🚀 ~ UserService ~ uploadFile ~ error:', error);
    }
  }

  // lấy id lớn nhất
  public async GetMaxID(): Promise<number> {
    try {
      const response = await this.StoriesModel.findOne({}, { id: 1 })
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

  // lấy stories
  public async getStories(
    page: number,
    arr: Array<number>,
    userId: number,
  ): Promise<Array<object>> {
    try {
      const skip = (page - 1) * 20;
      const limit = 20;
      const response = await this.StoriesModel.aggregate([
        {
          $match: {
            $or: [{ user_id: { $in: arr } }, { user_id: userId }],
            // created_at: { $gt: new Date().getTime() - 24 * 60 * 60 },
          },
        },
        { $sort: { created_at: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: 'id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
        {
          $project: {
            name: '$user.name',
            created_at: 1,
            user_id: 1,
            seen: {
              $cond: {
                if: { $in: [userId, '$user_seen'] },
                then: true,
                else: false,
              },
            },
            avatar: {
              $concat: [
                {
                  $cond: {
                    if: { $ne: ['$user.avatar', null] },
                    then: `${process.env.DOMAIN}`,
                    else: '$$REMOVE',
                  },
                },
                {
                  $cond: {
                    if: { $ne: ['$user.avatar', null] },
                    then: '$user.avatar',
                    else: '$$REMOVE',
                  },
                },
              ],
            },
            image: {
              $concat: [
                {
                  $cond: {
                    if: { $ne: ['$image', null] },
                    then: `${process.env.DOMAIN}`,
                    else: '$$REMOVE',
                  },
                },
                {
                  $cond: {
                    if: { $ne: ['$image', null] },
                    then: '$image',
                    else: '$$REMOVE',
                  },
                },
              ],
            },
            video: {
              $concat: [
                {
                  $cond: {
                    if: { $ne: ['$video', null] },
                    then: `${process.env.DOMAIN}`,
                    else: '$$REMOVE',
                  },
                },
                {
                  $cond: {
                    if: { $ne: ['$video', null] },
                    then: '$video',
                    else: '$$REMOVE',
                  },
                },
              ],
            },
          },
        },
        {
          $group: {
            _id: '$user_id',
            data: { $push: '$$ROOT' },
          },
        },
      ]);
      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
