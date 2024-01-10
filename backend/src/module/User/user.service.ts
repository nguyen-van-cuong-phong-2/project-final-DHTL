/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
    BadRequestException,
    Body,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    PayloadTooLargeException,
} from '@nestjs/common';
import * as fs from 'node:fs';
import { Users } from 'src/Schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterUserDto } from './dto/register.dto';
import * as crypto from 'crypto';
import { Login } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as path from 'path';
import { Friend } from 'src/Schemas/friend.schema';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(Users.name) private UsersModel: Model<Users>,
        @InjectModel(Friend.name) private FriendsModel: Model<Friend>,
        private readonly jwtService: JwtService,
        private readonly NotificationService: NotificationService,
    ) { }

    // Đăng kí tài khoản
    public async RegisterAccout(
        @Body() registerUserDto: RegisterUserDto,
    ): Promise<object> {
        try {
            const id = await this.GetMaxID();
            const created_at = Math.round(new Date().getTime());
            const password = this.createMd5(registerUserDto.password);
            const conditions = {
                id,
                created_at,
                password,
                birthDay: new Date(registerUserDto.birthDay).getTime(),
                userName: registerUserDto.userName,
                name: registerUserDto.name
            }
            await this.UsersModel.create(conditions);
            const token = await this.generateToken(conditions);
            const refreshToken = await this.generateToken(conditions);
            return {
                id,
                token,
                refreshToken,
            };
        } catch (error) {
            throw new BadRequestException(error.message, 'Bad request');
        }
    }

    // lấy id lớn nhất
    public async GetMaxID(): Promise<number> {
        try {
            const response = await this.UsersModel.findOne({}, { id: 1 })
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

    // tạo mật khẩu md5
    private createMd5(password: string): string {
        return crypto.createHash('md5').update(password).digest('hex');
    }

    // kiểm tra mật khẩu
    private verifyPassword(
        inputPassword: string,
        hashedPassword: string,
    ): boolean {
        const md5Hash = crypto
            .createHash('md5')
            .update(inputPassword)
            .digest('hex');
        return md5Hash === hashedPassword;
    }

    // hàm tạo token
    private generateToken(payload: any): Promise<string> {
        return this.jwtService.signAsync(payload);
    }

    // check tài khoản tồn tại
    public async checkAccountExists(userName: string): Promise<boolean> {
        try {
            const check = await this.UsersModel.findOne({ userName }).lean();
            return !!check;
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    // hàm đăng nhập
    public async login(@Body() login: Login): Promise<object> {
        const hashedPassword = this.createMd5(login.password);
        const checkExists = await this.UsersModel.findOne({ userName: login.userName, password: hashedPassword }, { password: 0 }).lean();
        if (!checkExists) throw new NotFoundException("Tài khoản hoặc mật khẩu không chính xác");
        const token = await this.generateToken(checkExists);
        const refreshToken = await this.generateToken(checkExists);
        return { token, refreshToken, data: checkExists }
    }

    // upload file 
    public async uploadFile(file: any, time: number, pathFolder: string, type?: number) {
       try {
        console.log("🚀 ~ UserService ~ uploadFile ~ file:", file)
        const path1 = `./storage/pictures/${pathFolder}/`;
        const filePath = `./storage/pictures/${pathFolder}/${time}_${file.originalname}`;
        const fileCheck = path.extname(filePath);

        if (type === 1) {
            const size = file.size / 1000000;
            if (size > 100) {
                throw new PayloadTooLargeException('File quá lớn')
            } else if (['.mp4'].includes(fileCheck.toLocaleLowerCase()) === false) {
                return false
            }
        } else if (['.jpg', '.png'].includes(fileCheck.toLocaleLowerCase()) === false) {
                return false;
            }
        
        if (!fs.existsSync(path1)) {
            fs.mkdirSync(path1, { recursive: true });
        }
        fs.writeFileSync(filePath, file.buffer);
        return `/pictures/${pathFolder}/${time}_${file.originalname}`;
       } catch (error) {
        console.log("🚀 ~ UserService ~ uploadFile ~ error:", error)
        
       }
    }

    // lưu file đã upload vào base
    public async saveFileOnBase(id: number, path: string): Promise<void> {
        try {
            await this.UsersModel.findOneAndUpdate({ id }, { avatar: path });
        } catch (error) {
            throw new BadRequestException(error.message, 'Bad request');
        }
    }

    // lấy thông tin người dùng (thiếu lấy danh sách bạn bè online và offline)
    public async getInfoUser(id: number, id_token?: number): Promise<object> {
        try {
            const response_Promise = this.UsersModel.findOne({ id }, { password: 0 }).lean();
            const totalNoti_Promise = this.NotificationService.getTotalNotification(id);
            const totalFriend_Promise = this.FriendsModel.countDocuments({
                $or: [
                    { receiver_id: id },
                    { sender_id: id },
                ],
                status: 1
            })
            const [response, totalNoti, totalFriend] = await Promise.all([
                response_Promise, totalNoti_Promise, totalFriend_Promise
            ])
            if (response) {
                response.avatar = `${process.env.DOMAIN}${response.avatar}`;
                if (id && id_token && id !== id_token) {
                    const checkFriend = await this.FriendsModel.findOne({
                        $or: [
                            {
                                $and: [
                                    { sender_id: id },
                                    { receiver_id: id_token }
                                ]
                            },
                            {
                                $and: [
                                    { receiver_id: id },
                                    { sender_id: id_token }
                                ]
                            }
                        ]
                    }).lean();
                    type Objectt = {
                        id: number,
                        avatar: string,
                        name: string,
                        makefriend: number,
                        totalNoti: number,
                        totalFriend: number,
                    }
                    const object: Objectt = {
                        ...response,
                        makefriend: 0,
                        totalNoti,
                        totalFriend
                    }
                    if (!checkFriend) object.makefriend = 0;
                    else if (checkFriend.status == 0 && id_token === checkFriend.sender_id) object.makefriend = 1;
                    else if (checkFriend.status == 0 && id_token === checkFriend.receiver_id) object.makefriend = 2;
                    else if (checkFriend.status == 1) object.makefriend = 3;
                    return object
                }
                return { totalNoti, totalFriend, ...response }
            }
            throw new NotFoundException('Không tìm thấy người dùng')
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    // tìm kiếm người dùng
    public async SearchUser(key: string, id: number): Promise<object> {
        try {
            const response = await this.UsersModel.aggregate([
                { $match: { name: new RegExp(key, 'i') } },
            ]);

            const arrMakeFriend = await Promise.all(response.map(item => (
                this.FriendsModel.findOne({
                    $or: [
                        {
                            $and: [
                                { sender_id: id },
                                { receiver_id: item.id }
                            ]
                        },
                        {
                            $and: [
                                { receiver_id: id },
                                { sender_id: item.id }
                            ]
                        }
                    ]
                }, { password: 0 }).lean()
            )));
            for (let i = 0; i < response.length; i++) {
                const element = response[i];
                if (element.avatar) element.avatar = `${process.env.DOMAIN}${element.avatar}`;
                element.makefriend = arrMakeFriend[i]?.status ? 1 : 0;
                if (!arrMakeFriend[i]) element.makefriend = 0;
                else element.makefriend = arrMakeFriend[i]?.status == 0 ? 1 : 2;
            }
            return response
        } catch (error) {
            throw new BadRequestException()
        }

    }

    // update thời gian online
    public async LastOnline(id: number): Promise<void> {
        try {
            await this.UsersModel.findOneAndUpdate({ id: id }, { lastLogin: new Date().getTime() })
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    // lấy thời gian online
    public async GetOffline(id: number): Promise<number> {
        try {
            const response = await this.UsersModel.findOne({ id: id }, { lastLogin: 1 }).lean();
            if (response) return response?.lastLogin
            else throw new NotFoundException("Không tìm thấy user")
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
}
