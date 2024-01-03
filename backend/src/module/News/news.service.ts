/* eslint-disable prettier/prettier */
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
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private NewsModel: Model<News>,
    @InjectModel(Like.name) private LikeModel: Model<Like>,
    @InjectModel(Comment.name) private CommentModel: Model<Comment>,
    @Inject(EventsGateway) private readonly appGateway: EventsGateway,
    private readonly notificationService: NotificationService,
  ) { }

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
      const skip = (page - 1) * 10;
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
        const maxId_noti = await this.notificationService.GetMaxID();
        const new_userId = await this.NewsModel.findOne(
          { id: data.news_id },
          { userId: 1 },
        ).lean();
        if (new_userId) {
          Promise.all([
            this.appGateway.sendNotification({
              sender_id: Number(data.userId),
              receiver_id: new_userId.userId,
              type: 2,
              type_enmoji: data.type,
            }),
            this.LikeModel.create(data),
            this.notificationService.createNotifi({
              id: maxId_noti,
              sender_id: Number(data.userId),
              receiver_id: new_userId.userId,
              created_at: new Date().getTime(),
              type: 3,
              link: '#',
              type_enmoji: data.type,
            }),
          ]);
        }
        throw new NotFoundException('Không tìm thấy bài viết');
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
      const data_promise = this.NewsModel.aggregate([
        { $match: { id } },
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
            comment: 1,
          },
        },
      ]);
      const comment_promise = this.CommentModel.aggregate([
        { $match: { news_id: id, parent_id: 0 } },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: 'id',
            as: 'user',
          }
        },
        { $sort: { created_at: -1 } },
        { $unwind: '$user' },
        {
          $project: {
            name: "$user.name",
            created_at: 1,
            content: 1,
            image: 1,
            id: 1,
            avatar: {
              $concat: [
                {
                  $cond: {
                    if: { $ne: ["$user.avatar", null] },
                    then:  `${process.env.DOMAIN}`,  
                    else: "$$REMOVE"
                  }
                },
                {
                  $cond: {
                    if: { $ne: ["$user.avatar", null] },
                    then: "$user.avatar",  
                    else: "$$REMOVE"
                  }
                }
              ]
            }
          }
        }
      ])
      const [data, total_like, comment] = await Promise.all([
        data_promise,
        this.LikeModel.countDocuments({ news_id: id }),
        comment_promise
      ]);

      const comment_child = await Promise.all(
        comment?.map((item: any) => (
          this.CommentModel.aggregate([
            { $match: { parent_id: item.id } },
            {
              $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: 'id',
                as: 'user',
              }
            },
            { $sort: { created_at: 1 } },
            { $unwind: '$user' },
            {
              $project: {
                name: "$user.name",
                avatar: {
                  $concat: [
                    {
                      $cond: {
                        if: { $ne: ["$user.avatar", null] },
                        then:  `${process.env.DOMAIN}`,  
                        else: "$$REMOVE"
                      }
                    },
                    {
                      $cond: {
                        if: { $ne: ["$user.avatar", null] },
                        then: "$user.avatar",  
                        else: "$$REMOVE"
                      }
                    }
                  ]
                },
                created_at: 1,
                content: 1,
                image: 1,
                images: {
                  $concat: [
                    {
                      $cond: {
                        if: { $ne: ["$image", null] },
                        then:  `${process.env.DOMAIN}`,  
                        else: "$$REMOVE"
                      }
                    },
                    {
                      $cond: {
                        if: { $ne: ["$image", null] },
                        then: "$image",  
                        else: "$$REMOVE"
                      }
                    }
                  ]
                }
              }
            }
          ])
        )))
      for (let i = 0; i < comment.length; i++) {
        const element = comment[i];
        if (element.image) element.image = `${process.env.DOMAIN}${element.image}`
        element.comment_child = comment_child[i]
      }

    
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
        element.total_like = total_like;
        element.comment = comment;
      }
      return data[0];
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // comment bài viết
  public async Comment(
    id: number,
    userId: number,
    news_id: number,
    created_at: number,
    content: string,
    parent_id: number,
    image?: any,
  ): Promise<void> {
    try {
      await this.CommentModel.create({
        id,
        userId,
        news_id,
        created_at,
        content,
        parent_id,
        image: image ? image : null,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
