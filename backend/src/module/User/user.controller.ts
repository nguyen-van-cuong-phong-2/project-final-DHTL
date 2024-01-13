/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Post,
  Body,
  UsePipes,
  ConflictException,
  Res,
  NotFoundException,
  Req,
  UploadedFile,
  UseInterceptors,
  NotAcceptableException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { RegisterUserDto } from './dto/register.dto';
import { Login } from './dto/login.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { getInfor } from './dto/getInfo.dto';
import { FriendService } from '../Friend/friend.service';
import { NewsService } from '../News/news.service';

interface UserPayload {
  id: string;
}

interface ExtendedRequest extends Request {
  user?: UserPayload;
}

@Controller('user')
export class UserController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly userService: UserService,
    private readonly friendSerivce: FriendService,
    private readonly newsService: NewsService,
  ) { }

  // Đăng kí tài khoản
  @Post('register')
  @UsePipes(new ValidationPipe())
  async RegisterAccount(
    @Body() registerUserDto: RegisterUserDto,
    @Res() res: Response,
  ): Promise<object> {
    const checkExists = await this.userService.checkAccountExists(
      registerUserDto.userName,
    );
    if (checkExists)
      throw new ConflictException('Tài khoản này đã được sử dụng');

    const response = await this.userService.RegisterAccout(registerUserDto);

    return res.status(200).json({
      result: true,
      message: 'Tạo tài khoản thành công',
      data: { ...response },
    });
  }

  // Đăng nhập
  @Post('login')
  @UsePipes(new ValidationPipe())
  async Login(@Body() login: Login, @Res() res: Response): Promise<object> {
    try {
      const response = await this.userService.login(login);
      return res.status(200).json({
        result: true,
        message: 'Đăng nhập thành công',
        data: { ...response },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  // Cập nhật avatar
  @Post('uploadAvatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: ExtendedRequest,
  ) {
    if (!file) throw new NotFoundException('Không tìm thấy file tải lên');
    const checkUpload = await this.userService.uploadFile(
      file,
      new Date().getTime(),
      'avatar',
    );
    if (!checkUpload) {
      throw new NotAcceptableException('Định dạng file không hợp lệ');
    }
    if (req.user && req.user.id) {
      await this.userService.saveFileOnBase(Number(req.user.id), checkUpload);
      return {
        status: 200,
        result: true,
        message: 'Upload file thành công',
      };
    } else {
      return {
        status: 400,
        result: true,
        message: 'Upload file thất bại',
      };
    }
  }

  // Cập nhật ảnh bìa
  @Post('uploadFileCoverImage')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileCoverImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: ExtendedRequest,
  ) {
    if (!file) throw new NotFoundException('Không tìm thấy file tải lên');
    const checkUpload = await this.userService.uploadFile(
      file,
      new Date().getTime(),
      'anh_bia',
    );
    if (!checkUpload) {
      throw new NotAcceptableException('Định dạng file không hợp lệ');
    }
    if (req.user && req.user.id) {
      await this.userService.saveFileCoverImageOnBase(
        Number(req.user.id),
        checkUpload,
      );
      return {
        status: 200,
        result: true,
        message: 'Upload file thành công',
      };
    } else {
      return {
        status: 400,
        result: true,
        message: 'Upload file thất bại',
      };
    }
  }

  // lấy thông tin user
  @Post('getInforUser')
  @UsePipes(new ValidationPipe())
  async GetInforUser(
    @Body() getInfor: getInfor,
    @Req() req: ExtendedRequest,
  ): Promise<object> {
    try {
      const result = await this.userService.getInfoUser(
        getInfor.id,
        Number(req?.user?.id),
      );
      return {
        status: 200,
        result: true,
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }

  // tìm kiếm user
  @Post('SearchUser')
  @UsePipes(new ValidationPipe())
  async SearchUser(
    @Body() data: { key: string },
    @Req() req: ExtendedRequest,
  ): Promise<object> {
    try {
      if (req.user && req.user.id) {
        const result = await this.userService.SearchUser(
          data.key,
          Number(req.user.id),
        );
        return {
          status: 200,
          result: true,
          data: result,
        };
      }
      return {
        status: 401,
        result: false,
      };
    } catch (error) {
      throw error;
    }
  }

  // lấy thời gian offline người dùng
  @Post('getOfflineUser')
  @UsePipes(new ValidationPipe())
  async getOfflineUser(@Body() data: { id: number }): Promise<object> {
    try {
      const response = await this.userService.GetOffline(data.id);
      return {
        status: 200,
        result: true,
        data: response,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // gợi ý người dùng
  @Post('SuggestFriends')
  @UsePipes(new ValidationPipe())
  async SuggestFriends(@Req() req: ExtendedRequest): Promise<object> {
    try {
      if (req.user && req.user.id) {
        const arrFriend = await this.friendSerivce.getListFriend(
          Number(req.user.id),
        );
        const arr: any[] = [];
        arrFriend.map((item: any) => arr.push(item.id));
        const response = await this.userService.SuggestFriends(
          arr,
          Number(req.user.id),
        );
        return {
          status: 200,
          result: true,
          data: response,
        };
      } else {
        throw new ForbiddenException('forbiden');
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // lấy thông tin trang cá nhân
  @Post('GetDataProfile')
  @UsePipes(new ValidationPipe())
  async GetDataProfile(
    @Body()
    data: {
      id: number;
    },
    @Req() req: ExtendedRequest,
  ): Promise<any> {
    try {
      if (req.user && req.user.id && data.id) {
        const [list_friends, list_friend_self] = await Promise.all([
          this.friendSerivce.getListFriend(
            Number(data.id)
          ),
          this.friendSerivce.getListFriend(
            Number(req.user.id)
          )
        ])
        const arrID: any[] = [];
        const arrID2: any[] = [];
        list_friends.map((item: any) => arrID.push(item.id));
        list_friend_self.map((item: any) => arrID2.push(item.id));
        const [news, total] = await Promise.all([
          this.newsService.GetNewsProfile(
            data.id,
            Number(req.user.id),
            arrID,
          ),
          this.friendSerivce.getTotalFriendMutual(arrID, arrID2)
        ])

        const image = await this.newsService.GetImageNews(news)
        for (let i = 0; i < list_friends.length; i++) {
          const element = list_friends[i];
          element.total_friend_Mutual = total[i]
        }
        return {
          status: 200,
          result: true,
          data: {
            news,
            list_friends,
            image
          }
        };
      }
      throw new ForbiddenException('missing token');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
