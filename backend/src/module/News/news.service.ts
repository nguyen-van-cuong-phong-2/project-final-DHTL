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
      const skip = (page - 1) * 20;
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
        { $limit: 20 },
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
            share: 1,
            id_user_be_shared: 1,
            name_user_be_shared: 1
          },
        },
      ]);
      const total_like = await Promise.all(
        data.map((item: any) =>
          this.LikeModel.countDocuments({ news_id: item.id, comment_id: 0 }),
        ),
      );
      const total_comment = await Promise.all(
        data.map((item: any) =>
          this.CommentModel.countDocuments({ news_id: item.id }),
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
        element.total_comment = total_comment[i];
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
              type: 3,
              type_enmoji: data.type,
            }),
            this.LikeModel.create(data),
            this.notificationService.createNotifi({
              id: maxId_noti,
              sender_id: Number(data.userId),
              receiver_id: new_userId.userId,
              created_at: new Date().getTime(),
              type: 3,
              link: `/News?id=${data.news_id}`,
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
            share: 1,
            id_user_be_shared: 1,
            name_user_be_shared: 1
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
        {
          $lookup: {
            from: 'likes',
            localField: 'id',
            foreignField: 'comment_id',
            as: 'like',
          },
        },
        { $sort: { created_at: -1 } },
        { $unwind: '$user' },
        {
          $lookup: {
            from: 'likes',
            localField: 'id',
            foreignField: 'comment_id',
            pipeline: [{ $match: { userId: userId } }],
            as: 'my_like',
          },
        },
        {
          $project: {
            name: "$user.name",
            created_at: 1,
            content: 1,
            image: 1,
            id: 1,
            news_id: 1,
            avatar: {
              $concat: [
                {
                  $cond: {
                    if: { $ne: ["$user.avatar", null] },
                    then: `${process.env.DOMAIN}`,
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
            total_like: { $size: "$like" },
            my_like: {
              $cond: {
                if: { $ne: ["$my_like", []] },
                then: 1,
                else: 0
              }
            }
          }
        }
      ])
      const [data, total_like, comment, total_comment] = await Promise.all([
        data_promise,
        this.LikeModel.countDocuments({ news_id: id, comment_id: 0 }),
        comment_promise,
        this.CommentModel.countDocuments({ news_id: id })
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
            {
              $lookup: {
                from: 'likes',
                localField: 'id',
                foreignField: 'comment_id',
                as: 'like',
              },
            },
            {
              $lookup: {
                from: 'likes',
                localField: 'id',
                foreignField: 'comment_id',
                pipeline: [{ $match: { userId: userId } }],
                as: 'my_like',
              },
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
                        then: `${process.env.DOMAIN}`,
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
                id: 1,
                created_at: 1,
                content: 1,
                image: 1,
                images: {
                  $concat: [
                    {
                      $cond: {
                        if: { $ne: ["$image", null] },
                        then: `${process.env.DOMAIN}`,
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
                },
                total_like: { $size: "$like" },
                // my_like: 1
                my_like: {
                  $cond: {
                    if: { $ne: ["$my_like", []] },
                    then: 1,
                    else: 0
                  }
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
        element.total_comment = total_comment;
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
      const [maxId_noti, new_userId, user_comment] = await Promise.all([
        this.notificationService.GetMaxID(),
        this.NewsModel.findOne(
          { id: news_id },
          { userId: 1 },
        ).lean(),
        parent_id != 0 && this.CommentModel.findOne({ id: parent_id }, { userId: 1 }).lean()
      ]);

      if (new_userId) {
        await Promise.all([
          this.notificationService.createNotifi({
            id: maxId_noti,
            sender_id: Number(userId),
            receiver_id: new_userId.userId,
            created_at: new Date().getTime(),
            type: parent_id == 0 ? 4 : 5,
            link: `/News?id=${news_id}`,
          }),
          this.CommentModel.create({
            id,
            userId,
            news_id,
            created_at,
            content,
            parent_id,
            image: image ? image : null,
          }),
          this.appGateway.sendNotification({
            sender_id: Number(userId),
            receiver_id: new_userId.userId,
            type: parent_id == 0 ? 4 : 5,
          }),
          user_comment && this.appGateway.sendNotification({
            sender_id: Number(userId),
            receiver_id: user_comment.userId,
            type: 8
          }),
          user_comment && this.notificationService.createNotifi({
            id: maxId_noti + 1,
            sender_id: Number(userId),
            receiver_id: user_comment.userId,
            created_at: new Date().getTime(),
            type: 8,
            link: `/News?id=${news_id}`,
          }),
        ])
      } else {
        throw new NotFoundException('Không tìm thấy bài viết');
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // like comment
  public async LikeComment(data: likeNews): Promise<void> {
    try {
      const [maxId_noti, new_userId, check, user_comment] = await Promise.all([
        this.notificationService.GetMaxID(),
        this.NewsModel.findOne(
          { id: data.news_id },
          { userId: 1 },
        ).lean(),
        this.LikeModel.findOne({
          comment_id: data.comment_id,
          userId: data.userId
        }),
        this.CommentModel.findOne({ id: data.comment_id }, { userId: 1 }).lean()
      ])
      const update = check ? (this.LikeModel.findOneAndUpdate({ comment_id: data.comment_id, userId: data.userId }, { type: data.type })) : (
        this.LikeModel.create(data)
      )
      if (new_userId && user_comment) {
        Promise.all([
          !check && this.appGateway.sendNotification({
            sender_id: Number(data.userId),
            receiver_id: new_userId.userId,
            type: 6,
            type_enmoji: data.type,
          }),
          !check && this.appGateway.sendNotification({
            sender_id: Number(data.userId),
            receiver_id: user_comment.userId,
            type: 7,
            type_enmoji: data.type,
          }),
          update,
          !check && this.notificationService.createNotifi({
            id: maxId_noti,
            sender_id: Number(data.userId),
            receiver_id: new_userId.userId,
            created_at: new Date().getTime(),
            type: 6,
            link: `/News?id=${data.news_id}`,
            type_enmoji: data.type,
          }),
          !check && this.notificationService.createNotifi({
            id: maxId_noti + 1,
            sender_id: Number(data.userId),
            receiver_id: user_comment.userId,
            created_at: new Date().getTime(),
            type: 7,
            link: `/News?id=${data.news_id}`,
            type_enmoji: data.type,
          }),
        ]);
      } else {
        throw new NotFoundException('Không tìm thấy bài viết');
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // lấy bài viết trang cá nhân
  public async GetNewsProfile(id: number, id_user: number, list_friends: Array<number>): Promise<object[]> {

    try {
      const conditions: any = { userId: Number(id) };
      if (id !== id_user) {
        conditions.type_seen = list_friends.includes(id_user) ? { $in: [1, 2] } : 2
      } else {
        delete conditions.type_seen
      }

      const response = await this.NewsModel.aggregate([
        { $match: conditions },
        { $sort: { created_at: -1 } },
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
            share: 1,
            id_user_be_shared: 1,
            name_user_be_shared: 1
          },
        },
      ]);
      const total_like = await Promise.all(
        response.map((item: any) =>
          this.LikeModel.countDocuments({ news_id: item.id, comment_id: 0 }),
        ),
      );
      const total_comment = await Promise.all(
        response.map((item: any) =>
          this.CommentModel.countDocuments({ news_id: item.id }),
        ),
      );
      for (let i = 0; i < response.length; i++) {
        const element = response[i];
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
        element.total_comment = total_comment[i];
      }
      return response
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // share bài viết
  public async ShareNews(data: { id: number, news_id: number, userId: number, type_seen: number }): Promise<void> {
    try {
      const news = await this.NewsModel.aggregate([
        { $match: { id: data.news_id } },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "id",
            as: "user"
          }
        },
        { $unwind: "$user" },
        {
          $project: {
            content: 1,
            image: 1,
            name: "$user.name",
            id: "$user.id",
          }
        }
      ]);
      if (!news[0]) throw new NotFoundException("Không tìm thấy bài viết")

      await this.NewsModel.create({
        id: data.id,
        userId: data.userId,
        content: news[0].content,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
        image: news[0].image,
        type_seen: data.type_seen,
        share: 1,
        id_user_be_shared: news[0].id,
        name_user_be_shared: news[0].name,
      })
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // lấy ảnh của bài viết
  public async GetImageNews(arrNews: any[]): Promise<string[]> {
    try {
      const arr: string[] = [];
      for (let i = 0; i < arrNews.length; i++) {
        const element = arrNews[i];
        element.image.map((item: any) => arr.push(item))
      }
      return arr
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}