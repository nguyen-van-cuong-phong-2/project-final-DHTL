/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, ForbiddenException, NotAcceptableException, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ReelsService } from './reels.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from '../User/user.service';

interface ExtendedRequest extends Request {
    user?: { id: string }
}
@Controller('reels')
export class ReelsController {
    constructor(private readonly reelsService: ReelsService,
        private readonly userService: UserService) { }

    // Đăng reels
    @Post('PostReels')
    @UseInterceptors(FileInterceptor('file'))
    async PostReels(@Req() req: ExtendedRequest, @UploadedFile() file: Express.Multer.File): Promise<object> {
        try {
            if (req.user && req.user.id) {
                if (file) {
                    const created_at = new Date().getTime();
                    const video = await this.userService.uploadFile(file, created_at, 'video', 1)
                    if (!video) throw new NotAcceptableException('Định dạng video không hợp lệ')
                    const id = await this.reelsService.GetMaxID();
                    this.reelsService.PostReels({
                        id,
                        created_at,
                        video: video,
                        userId: Number(req.user.id)
                    });
                    return {
                        status: 200,
                        result: true
                    }
                }
            }
            throw new ForbiddenException("Không tìm thấy id người dùng")
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    // lấy reels
    @Post('GetReels')
    async GetReels(@Body() data: { page: number }, @Req() req: ExtendedRequest): Promise<object> {
        try {
            if (req.user && req.user.id && data.page) {
                const response = await this.reelsService.GetReels({ page: data.page, userID: Number(req.user.id), });
                return {
                    status: 200,
                    result: true,
                    data: response
                }
            }
            throw new ForbiddenException("Không tìm thấy id người dùng")
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
}
