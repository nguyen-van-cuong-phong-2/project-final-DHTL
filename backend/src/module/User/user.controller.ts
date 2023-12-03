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
} from '@nestjs/common';
import { UserService } from './user.service';
import { ValidationPipe } from 'src/pipes/validation.pipe';
import { RegisterUserDto } from './dto/register.dto';
import { Login } from './dto/login.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly userService: UserService) { }

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
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new NotFoundException('Không tìm thấy file tải lên');
    const checkUpload = await this.userService.uploadFile(
      file,
      new Date().getTime(),
      'avatar',
    );
    if (!checkUpload) {
      throw new NotAcceptableException('Định dạng file không hợp lệ');
    }
    return {
      status: 200,
      result: true,
      message: 'Upload file thành công',
    };
  }
}
