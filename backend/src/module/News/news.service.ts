import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { News } from 'src/Schemas/news.schema';

@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private NewsModel: Model<News>) {}

  // đăng tin
  public async createNews(data: {
    id: number;
    userId: number;
    content: string;
    created_at: number;
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
}
