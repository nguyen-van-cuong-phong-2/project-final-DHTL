/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { makeFriends } from './dto/makefriend.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Friend } from 'src/Schemas/friend.schema';
import { Model } from 'mongoose';
import { NotificationService } from '../notification/notification.service';
import { Users } from 'src/Schemas/user.schema';
@Injectable()
export class FriendService {
    constructor(
        @InjectModel(Friend.name) private FriendsModel: Model<Friend>,
        @InjectModel(Users.name) private UsersModel: Model<Users>,
        private readonly NotificationService: NotificationService,
    ) { }

    // gửi kết bạn
    public async SendMakeFriend(data: makeFriends) {
        try {
            const check = await this.FriendsModel.findOne({
                $or: [
                    {
                        $and: [
                            { sender_id: data.sender_id },
                            { receiver_id: data.receiver_id }
                        ]
                    },
                    {
                        $and: [
                            { sender_id: data.receiver_id },
                            { receiver_id: data.sender_id }
                        ]
                    }
                ]
            });
            const id = await this.NotificationService.GetMaxID();
            this.NotificationService.createNotifi({
                id,
                sender_id: data.sender_id,
                receiver_id: data.receiver_id,
                created_at: new Date().getTime(),
                type: 1,
                link: `/Profile?id=${data.sender_id}`
            })
            if (check) {
                this.FriendsModel.findOneAndUpdate({ id: check.id }, { status: 1 });
                return 1
            } else {
                this.FriendsModel.create(data);
                return 2
            }
        } catch (error) {
            throw new BadRequestException('Bad request', error);
        }
    }

    // get max id friendsModel
    public async GetMaxID(): Promise<number> {
        try {
            const response = await this.FriendsModel.findOne({}, { id: 1 })
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

    // đồng ý kết bạn
    public async AcceptMakeFriend(sender_id: number, receiver_id: number): Promise<void> {
        try {
            await this.FriendsModel.findOneAndUpdate({
                $or: [
                    {
                        $and: [
                            { sender_id: sender_id },
                            { receiver_id: receiver_id }
                        ]
                    },
                    {
                        $and: [
                            { sender_id: receiver_id },
                            { receiver_id: sender_id }
                        ]
                    }
                ]
            }, { status: 1 });
            const id = await this.NotificationService.GetMaxID();
            await this.NotificationService.createNotifi({
                id,
                sender_id: receiver_id,
                receiver_id: sender_id,
                created_at: new Date().getTime(),
                type: 2,
                link: `/Profile?id=${receiver_id}`
            })
        } catch (error) {
            throw new BadRequestException('Bad request', error.message);
        }
    }

    // huỷ kết bạn
    public async DeleteMakeFriend(sender_id: number, receiver_id: number): Promise<void> {
        try {

            const response = await this.FriendsModel.findOneAndDelete({
                $or: [
                    {
                        $and: [
                            { sender_id: sender_id },
                            { receiver_id: receiver_id }
                        ]
                    },
                    {
                        $and: [
                            { sender_id: receiver_id },
                            { receiver_id: sender_id }
                        ]
                    }
                ]
            });
        } catch (error) {
            throw new BadRequestException('Bad request', error.message);
        }
    }

    // danh sách bạn bè
    public async getListFriend(id: number): Promise<any> {
        const response = await this.FriendsModel.aggregate([
            {
                $match: {
                    $or: [
                        { sender_id: id },
                        { receiver_id: id }
                    ],
                    status: 1
                }
            },
            {
                $project: {
                    sender_id: 1,
                    receiver_id: 1
                }
            }
        ]);
        const arr: number[] = [];
        response.map(item => {
            if (item.sender_id != id) arr.push(item.sender_id)
            if (item.receiver_id != id) arr.push(item.receiver_id)
        })

        const arrUser = await this.UsersModel.find({
            id: { $in: arr }
        }).lean()
        for (let i = 0; i < arrUser.length; i++) {
            const element = arrUser[i];
            if (element.avatar)
                element.avatar = `${process.env.DOMAIN}${element.avatar}`;
        }
        return arrUser;
    }
}
