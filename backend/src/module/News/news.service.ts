import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News } from 'src/Schemas/news.schema';
import { likeNews } from './dto/likeNews.dto';
import { Like } from 'src/Schemas/like.schema';
import { Comment } from 'src/Schemas/comment.schema';
import { EventsGateway } from 'src/Socket/events.gateway';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private NewsModel: Model<News>,
    @InjectModel(Like.name) private LikeModel: Model<Like>,
    @InjectModel(Comment.name) private CommentModel: Model<Comment>,
    @Inject(EventsGateway) private readonly appGateway: EventsGateway,
  ) {}

  // đăng tin
  public async createNews(data: {
    id: number;
    userId: number;
    content: string;
    created_at: number;
    updated_at: number;
    image?: Array<string>;
    type_seen: number;
  }): Promise<void> {
    try {
      await this.NewsModel.create(data);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // lấy id lớn nhất
  public async GetMaxID(): Promise<number> {
    try {
      const response = await this.NewsModel.findOne({}, { id: 1 })
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

  // lấy bài viết trang chủ
  public async GetNews(
    id: number,
    page: number,
    list_friends: Array<object>,
  ): Promise<Array<object>> {
    try {
      const skip = (page - 1) * 5;
      const data = await this.NewsModel.aggregate([
        {
          $match: {
            $or: [
              { type_seen: 2 },
              { type_seen: 1, userId: { $in: list_friends } },
              { userId: id },
            ],
          },
        },
        { $sort: { created_at: -1 } },
        { $skip: skip },
        { $limit: 5 },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: 'id',
            as: 'user',
          },
        },
        {
          $lookup: {
            from: 'likes',
            localField: 'id',
            foreignField: 'news_id',
            pipeline: [{ $match: { userId: id } }],
            as: 'like',
          },
        },
        { $unwind: '$user' },
        { $unwind: { path: '$like', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            id: 1,
            userId: 1,
            content: 1,
            image: 1,
            type_seen: 1,
            avatar: '$user.avatar',
            name: '$user.name',
            updated_at: 1,
            type_like: '$like.type',
          },
        },
      ]);
      const total_like = await Promise.all(
        data.map((item: any) =>
          this.LikeModel.countDocuments({ news_id: item.id }),
        ),
      );
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        if (element.image && element.image.length > 0) {
          const arr = element.image.map(
            (item: string) => `${process.env.DOMAIN}${item}`,
          );
          element.image = arr;
        }
        if (element.avatar)
          element.avatar = `${process.env.DOMAIN}${element.avatar}`;
        if (!element.type_like && element.type_like != 0) {
          element.type_like = 10;
        } else {
          element.type_like = element.type_like + 2;
        }
        element.total_like = total_like[i];
      }
      return data;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // like bài viết
  public async LikeNews(data: likeNews): Promise<void> {
    try {
      const check = await this.LikeModel.findOne({
        userId: data.userId,
        news_id: data.news_id,
      });
      if (check && data.type == 0) {
        await this.LikeModel.deleteOne({
          userId: data.userId,
          news_id: data.news_id,
        });
      } else if (!check) {
        await this.LikeModel.create(data);
        this.appGateway.server.emit('sendNotification', 'gà');
      } else {
        await this.LikeModel.findOneAndUpdate(
          {
            userId: data.userId,
            news_id: data.news_id,
          },
          { type: data.type },
        );
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // lấy id lớn nhất bảng like
  public async GetMaxID_Like(): Promise<number> {
    try {
      const response = await this.LikeModel.findOne({}, { id: 1 })
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

  // lấy id lớn nhất bảng comment
  public async GetMaxID_Comment(): Promise<number> {
    try {
      const response = await this.CommentModel.findOne({}, { id: 1 })
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

  // lấy chi tiết bài viết
  public async GetDetailNews(id: number, userId: number): Promise<object> {
    try {
      const data = await this.NewsModel.aggregate([
        {
          $match: { id },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: 'id',
            as: 'user',
          },
        },
        {
          $lookup: {
            from: 'likes',
            localField: 'id',
            foreignField: 'news_id',
            pipeline: [{ $match: { userId: userId } }],
            as: 'like',
          },
        },
        { $unwind: '$user' },
        { $unwind: { path: '$like', preserveNullAndEmptyArrays: true } },
        {
          $project: {
            id: 1,
            userId: 1,
            content: 1,
            image: 1,
            type_seen: 1,
            avatar: '$user.avatar',
            name: '$user.name',
            updated_at: 1,
            type_like: '$like.type',
          },
        },
      ]);
      if (!data[0]) throw new NotFoundException('Không tìm thấy bài viết');
      const total_like = await Promise.all(
        data.map((item: any) =>
          this.LikeModel.countDocuments({ news_id: item.id }),
        ),
      );
      for (let i = 0; i < data.length; i++) {
        const element = data[i];
        if (element.image && element.image.length > 0) {
          const arr = element.image.map(
            (item: string) => `${process.env.DOMAIN}${item}`,
          );
          element.image = arr;
        }
        if (element.avatar)
          element.avatar = `${process.env.DOMAIN}${element.avatar}`;
        if (!element.type_like && element.type_like != 0) {
          element.type_like = 10;
        } else {
          element.type_like = element.type_like + 2;
        }
        element.total_like = total_like[i];
      }
      return data[0];
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
