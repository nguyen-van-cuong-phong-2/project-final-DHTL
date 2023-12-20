import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UnsupportedMediaTypeException,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { createNews } from './dto/createNews.dto';
import { UserService } from '../User/user.service';
import { NewsService } from './news.service';
import { ValidationPipe } from 'src/pipes/validation.pipe';

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
  ) {}
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
        console.log(files);
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
}
