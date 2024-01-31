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
import { Search } from 'src/Schemas/search.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterUserDto } from './dto/register.dto';
import * as crypto from 'crypto';
import { Login } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as path from 'path';
import { Friend } from 'src/Schemas/friend.schema';
import { NotificationService } from '../notification/notification.service';
import { MessageService } from '../Message/message.service';
import { FriendService } from '../Friend/friend.service';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(Users.name) private UsersModel: Model<Users>,
        @InjectModel(Friend.name) private FriendsModel: Model<Friend>,
        @InjectModel(Search.name) private SearchModel: Model<Search>,
        private readonly jwtService: JwtService,
        private readonly NotificationService: NotificationService,
        private readonly MessageService: MessageService,
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
            const path1 = `./storage/pictures/${pathFolder}/`;
            const filePath = `./storage/pictures/${pathFolder}/${time}_${file.originalname}`;
            const fileCheck = path.extname(filePath);

            if (type === 1) {
                const size = file.size / 1000000;
                if (size > 20) {
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
            throw new BadRequestException('Có lỗi xảy ra')
        }
    }

    // lưu file avatar đã upload vào base
    public async saveFileOnBase(id: number, path: string): Promise<object> {
        try {
            await this.UsersModel.findOneAndUpdate({ id }, { avatar: path });
            const data = await this.UsersModel.findOne({ id }, { password: 0 }).lean();
            const token = await this.generateToken(data);
            const refreshToken = await this.generateToken(data);
            return { token, refreshToken, data }

        } catch (error) {
            throw new BadRequestException(error.message, 'Bad request');
        }
    }

    // lưu file ảnh bìa đã upload vào base
    public async saveFileCoverImageOnBase(id: number, path: string): Promise<void> {
        try {
            await this.UsersModel.findOneAndUpdate({ id }, { coverImage: path });
        } catch (error) {
            throw new BadRequestException(error.message, 'Bad request');
        }
    }

    // lấy thông tin người dùng 
    public async getInfoUser(id: number, id_token: number): Promise<object> {
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
            const [response, totalNoti, totalFriend, total_message] = await Promise.all([
                response_Promise, totalNoti_Promise, totalFriend_Promise, this.MessageService.getTotalMessage(id_token)
            ])

            if (response) {
                response.avatar = `${process.env.DOMAIN}${response.avatar}`;
                response.coverImage = `${process.env.DOMAIN}${response.coverImage}`;
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
                    const checkSearch = await this.SearchModel.findOne({ user_id: id_token }).lean();

                    if (checkSearch) {
                        let arr = checkSearch.userSearch.includes(id) ? [...checkSearch.userSearch] : [id, ...checkSearch.userSearch];
                        if (arr.length > 10) {
                            arr = arr.slice(0, 10)
                        }
                        await this.SearchModel.findOneAndUpdate({ user_id: id_token }, { userSearch: arr })
                    } else {
                        const max_id = await this.SearchModel.findOne({}).sort({ id: -1 }).lean();
                        const id_search = max_id ? max_id?.id + 1 : 1;
                        await this.SearchModel.create({
                            id: id_search,
                            user_id: id_token,
                            userSearch: [id]
                        })
                    }
                    type Objectt = {
                        id: number,
                        avatar: string,
                        name: string,
                        makefriend: number,
                        totalNoti: number,
                        totalFriend: number,
                        total_message: number,
                    }
                    const object: Objectt = {
                        ...response,
                        makefriend: 0,
                        totalNoti,
                        totalFriend,
                        total_message
                    }
                    if (!checkFriend) object.makefriend = 0;
                    else if (checkFriend.status == 0 && id_token === checkFriend.sender_id) object.makefriend = 1;
                    else if (checkFriend.status == 0 && id_token === checkFriend.receiver_id) object.makefriend = 2;
                    else if (checkFriend.status == 1) object.makefriend = 3;
                    return object
                }
                return { totalNoti, totalFriend, ...response, total_message }
            }
            throw new NotFoundException('Không tìm thấy người dùng')
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }

    // tìm kiếm người dùng
    public async SearchUser(key: string, id: number): Promise<object> {
        try {
            let response = [];
            if (key && key != '') {
                response = await this.UsersModel.aggregate([
                    { $match: { name: new RegExp(key, 'i') } },
                ])
            } else {
                const arrUser = await this.SearchModel.findOne({ user_id: id }).lean();
                response = await this.UsersModel.aggregate([
                    { $match: { id: { $in: arrUser?.userSearch } } },
                ])
            }
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

    // Gợi ý bạn bè
    public async SuggestFriends(arr: number[], id: number): Promise<object> {
        try {
            const response = await this.UsersModel.aggregate([
                { $match: { id: { $nin: arr } } },
                { $sort: { id: -1 } },
                { $limit: 10 },
                {
                    $project: {
                        name: 1,
                        avatar: {
                            $concat: [
                                {
                                    $cond: {
                                        if: { $ne: ["$avatar", null] },
                                        then: `${process.env.DOMAIN}`,
                                        else: "$$REMOVE"
                                    }
                                },
                                {
                                    $cond: {
                                        if: { $ne: ["$avatar", null] },
                                        then: "$avatar",
                                        else: "$$REMOVE"
                                    }
                                }
                            ]
                        },
                        id: 1,
                    }
                }
            ]);
            const Friend_mutual = await Promise.all(
                response.map(item => (
                    this.FriendsModel.aggregate([
                        {
                            $match: {
                                $or: [
                                    {
                                        sender_id: item.id,
                                        receiver_id: { $in: arr },
                                        status: 1
                                    },
                                    {
                                        receiver_id: item.id,
                                        sender_id: { $in: arr },
                                        status: 1
                                    },
                                ]
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "sender_id",
                                foreignField: "id",
                                as: "user1"
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "receiver_id",
                                foreignField: "id",
                                as: "user2"
                            }
                        },
                        { $unwind: { path: "$user1", preserveNullAndEmptyArrays: true } },
                        { $unwind: { path: "$user2", preserveNullAndEmptyArrays: true } },
                        {
                            $project: {
                                avatar: {
                                    $concat: [
                                        `${process.env.DOMAIN}`,
                                        {
                                            $cond: {
                                                if: { $ne: ["$user1.avatar", item.id] },
                                                then: '$user1.avatar',
                                                else: '$user2.avatar',
                                            },
                                        }
                                    ]
                                }
                            }
                        }
                    ])
                ))
            );
            const checkFriend = await Promise.all(
                response.map(item => (
                    this.FriendsModel.find({
                        $or: [
                            {
                                sender_id: item.id,
                                receiver_id: id,
                            },
                            {
                                receiver_id: item.id,
                                sender_id: id,
                            },
                        ]
                    })
                ))
            );
            for (let i = 0; i < response.length; i++) {
                const element = response[i];
                element.total = Friend_mutual[i].length;
                element.avatar2 = [];
                Friend_mutual[i].map((item, index) => {
                    if (index <= 1) {
                        element.avatar2.push(item.avatar)
                    } else {
                        return
                    }
                })
                element.check_send_make_friend = checkFriend[i].length != 0 ? 1 : 0;
                if (checkFriend[i].length != 0) {
                    element.check_send_make_friend = checkFriend[i][0].sender_id == id ? 3 : 2;
                }
            }
            return response
        } catch (error) {
            throw new BadRequestException()
        }
    }

    // xác thực tài khoản
    public async authenticationAccount(id: number): Promise<object> {
        try {
            await this.UsersModel.findOneAndUpdate({ id }, { active: 1 });
            const data = await this.UsersModel.findOne({ id }, { password: 0 }).lean();
            const token = await this.generateToken(data);
            const refreshToken = await this.generateToken(data);
            return { token, refreshToken, data }
        } catch (error) {
            throw new BadRequestException(error.message, 'Bad request');
        }
    }
}
