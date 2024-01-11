/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Post,
  Req,
  UnsupportedMediaTypeException,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { createNews } from './dto/createNews.dto';
import { UserService } from '../User/user.service';
import { NewsService } from './news.service';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { FriendService } from '../Friend/friend.service';

interface UserPayload {
  id: string;
}
interface ExtendedRequest extends Request {
  user?: UserPayload;
}

@Controller('news')
export class NewsController {
  constructor(
    private readonly userService: UserService,
    private readonly newsService: NewsService,
    private readonly friendService: FriendService,
  ) { }

  // Đăng tin
  @Post('PostNews')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FilesInterceptor('files'))
  async PostNews(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: createNews,
    @Req() req: ExtendedRequest,
  ): Promise<object> {
    try {
      if (req.user && req.user.id) {
        const arrImage = [];
        const time = Math.round(new Date().getTime());
        if (files && files.length > 0) {
          for (let i = 0; i < files.length; i++) {
            const upload = await this.userService.uploadFile(
              files[i],
              time,
              'news',
            );
            if (!upload) throw new UnsupportedMediaTypeException();
            arrImage.push(upload);
          }
        }
        const id = await this.newsService.GetMaxID();
        await this.newsService.createNews({
          id,
          userId: Number(req.user.id),
          content: body.content,
          created_at: time,
          updated_at: time,
          type_seen: body.type_seen,
          image: arrImage,
        });
        return {
          result: true,
          status: 200,
        };
      }
      throw new BadRequestException();
    } catch (error) {
      throw error;
    }
  }

  // lấy tin trang chủ
  @Post('GetNews')
  @UsePipes(new ValidationPipe())
  async GetNews(
    @Body() data: { page: number },
    @Req() req: ExtendedRequest,
  ): Promise<object> {
    try {
      if (req.user && req.user.id && data) {
        const list_friends = await this.friendService.getListFriend(
          Number(req.user.id),
        );
        const arrID: any[] = [];
        list_friends.map((item: any) => arrID.push(item.id));
        const response = await this.newsService.GetNews(
          Number(req.user.id),
          data.page,
          arrID,
        );
        return {
          result: true,
          status: 200,
          data: response,
        };
      }
      throw new ForbiddenException('missing token');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // thích tin
  @Post('LikeNews')
  @UsePipes(new ValidationPipe())
  async LikeNews(
    @Body()
    data: {
      news_id: number;
      type: number;
    },
    @Req() req: ExtendedRequest,
  ): Promise<any> {
    try {
      if (req.user && req.user.id && data.news_id) {
        const id = await this.newsService.GetMaxID_Like();
        const created_at = new Date().getTime();
        await this.newsService.LikeNews({
          id,
          created_at,
          ...data,
          userId: Number(req.user.id),
          comment_id: 0
        });
        return {
          status: 200,
          result: true,
        };
      }
      throw new ForbiddenException('missing token');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // lấy chi tiết tin
  @Post('GetDetailNews')
  @UsePipes(new ValidationPipe())
  async GetDetailNews(
    @Body()
    data: {
      id: number;
    },
    @Req() req: ExtendedRequest,
  ): Promise<object> {
    try {
      if (req.user && req.user.id && data.id) {
        const response = await this.newsService.GetDetailNews(
          data.id,
          Number(req.user.id),
        );
        return {
          status: 200,
          result: true,
          data: response,
        };
      }
      throw new ForbiddenException('missing token');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // bình luận bài viết
  @Post('Comment')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('file'))
  async Comment(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: ExtendedRequest,
    @Body() data: { content: string, parent_id: number, news_id: number }
  ): Promise<object> {
    try {
      let Image = null;
      if (req.user && req.user.id && data.content && data.parent_id && data.news_id) {
        const time = Math.round(new Date().getTime());
        if (file) {
          const upload = await this.userService.uploadFile(
            file,
            time,
            'comment',
          );
          if (!upload) throw new UnsupportedMediaTypeException();
          Image = upload;
        }
        const id = await this.newsService.GetMaxID_Comment();
        await this.newsService.Comment(
          id,
          Number(req.user.id),
          data.news_id,
          time,
          data.content,
          data.parent_id,
          Image,

        );
        return {
          result: true,
          status: 200,
        };
      }
      throw new ForbiddenException('missing token');
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  // thích bình luận bài viết
  @Post('LikeComment')
  @UsePipes(new ValidationPipe())
  async LikeComment(
    @Body()
    data: {
      news_id: number;
      type: number;
      comment_id: number;
    },
    @Req() req: ExtendedRequest,
  ): Promise<any> {
    try {
      if (req.user && req.user.id && data.news_id && data.comment_id) {
        const id = await this.newsService.GetMaxID_Like();
        const created_at = new Date().getTime();
        await this.newsService.LikeComment({
          id,
          created_at,
          news_id: data.news_id,
          userId: Number(req.user.id),
          comment_id: data.comment_id,
          type: data.type
        });
        return {
          status: 200,
          result: true,
        };
      }
      throw new ForbiddenException('missing data');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // share bài viết
  @Post('ShareNews')
  @UsePipes(new ValidationPipe())
  async ShareNews(
    @Body()
    data: {
      news_id: number;
      type_seen: number;
    },
    @Req() req: ExtendedRequest,
  ): Promise<any> {
    try {
      if (req.user && req.user.id && data.news_id && data.type_seen) {
        const id = await this.newsService.GetMaxID();
        await this.newsService.ShareNews({
          id,
          news_id: data.news_id,
          userId: Number(req.user.id),
          type_seen: data.type_seen
        });
        return {
          status: 200,
          result: true,
        };
      }
      throw new ForbiddenException('missing token');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
