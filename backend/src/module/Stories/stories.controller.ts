import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TinService } from './stories.service';
import { FriendService } from '../Friend/friend.service';
import { UserService } from '../User/user.service';
interface ExtendedRequest extends Request {
  user?: { id: string };
}

@Controller('Stories')
export class TinController {
  constructor(
    private readonly StoriesService: TinService,
    private readonly friendService: FriendService,
    private readonly userService: UserService,
  ) {}

  // tải lên stories
  @Post('uploadStories')
  @UseInterceptors(FileInterceptor('file'))
  async uploadStories(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: ExtendedRequest,
  ): Promise<object> {
    try {
      if (file && req.user && req.user.id) {
        const created_at = new Date().getTime();
        const response = await this.StoriesService.uploadFile(
          file,
          created_at,
          'stories',
        );
        if (response) {
          const id = await this.StoriesService.GetMaxID();
          const video = response.type ? response.link : null;
          const image = response.type ? null : response.link;
          await this.StoriesService.uploadStories({
            id,
            user_id: Number(req.user.id),
            created_at,
            image,
            video,
          });
          return {
            status: 200,
            result: true,
          };
        }
        throw new BadRequestException('File không hợp lệ');
      }
      throw new BadRequestException('Không đủ thông tin');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // danh sách stories
  @Post('getListStories')
  async getListStories(
    @Body() data: { page: number },
    @Req() req: ExtendedRequest,
  ): Promise<object> {
    try {
      if (req.user && req.user.id && data) {
        const [list_friends, data_user] = await Promise.all([
          this.friendService.getListFriend(Number(req.user.id)),
          this.userService.getInfoUser(
            Number(req.user.id),
            Number(req.user.id),
          ),
        ]);
        const arrID: any[] = [];
        list_friends.map((item: any) => arrID.push(item.id));
        const response = await this.StoriesService.getStories(
          data.page,
          arrID,
          Number(req.user.id),
        );
        return {
          result: true,
          status: 200,
          data: response,
          data_user,
        };
      }
      throw new ForbiddenException('missing token');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // cập nhật đã xem
  @Post('updateSeen')
  async updateSeen(
    @Body() data: { id: number },
    @Req() req: ExtendedRequest,
  ): Promise<object> {
    try {
      if (req.user && req.user.id && data) {
        await this.StoriesService.updateSeen(data.id, Number(req.user.id));
        return {
          result: true,
          status: 200,
        };
      }
      throw new ForbiddenException('missing token');
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
