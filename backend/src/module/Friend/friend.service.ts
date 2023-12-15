/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { makeFriends } from './dto/makefriend.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Friend } from 'src/Schemas/friend.schema';
import { Model } from 'mongoose';

@Injectable()
export class FriendService {
    constructor(
        @InjectModel(Friend.name) private FriendsModel: Model<Friend>,
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
            if (check) {
                await this.FriendsModel.findOneAndUpdate({ id: check.id }, { status: 1 })
                return 1
            } else {
                await this.FriendsModel.create(data);
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
        } catch (error) {
            throw new BadRequestException('Bad request', error.message);
        }
    }

    // huỷ kết bạn
    public async DeleteMakeFriend(sender_id: number, receiver_id: number): Promise<void> {
        try {
            await this.FriendsModel.findOneAndDelete({
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
}
