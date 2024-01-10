/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reels } from 'src/Schemas/reels.schema';

@Injectable()
export class ReelsService {
    constructor(@InjectModel(Reels.name) private ReelsModel: Model<Reels>

    ) { }

    // Đăng reels
    public async PostReels(data: {
        id: number;
        userId: number;
        video: string;
        created_at: number;
    }): Promise<void> {
        try {
            await this.ReelsModel.create(data);
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // lấy id lớn nhất
    public async GetMaxID(): Promise<number> {
        try {
            const response = await this.ReelsModel.findOne({}, { id: 1 })
                .sort({ id: -1 })
                .lean();
            if (response) {
                return response.id + 1;
            } else {
                return 1;
            }
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    // lấy reels
    public async GetReels(data: {
        page: number,
        userID: number
    }): Promise<object[]> {
        try {
            const skip = (data.page - 1) * 20;
            const response = await this.ReelsModel.aggregate([
                { $sort: { created_at: -1 } },
                { $skip: skip },
                { $limit: 20 },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: 'id',
                        as: 'user',
                    }
                },
                { $unwind: "$user" },
                {
                    $project: {
                        "avatar": {
                            $concat: [
                                {
                                    $cond: {
                                        if: { $ne: ["$user.avatar", null] },
                                        then: `${process.env.DOMAIN}`,
                                        else: "$$REMOVE"
                                    }
                                },
                                {
                                    $cond: {
                                        if: { $ne: ["$user.avatar", null] },
                                        then: "$user.avatar",
                                        else: "$$REMOVE"
                                    }
                                }
                            ]
                        },
                        "name": "$user.name",
                        "created_at": 1,
                        "video": {
                            $concat: [
                                {
                                    $cond: {
                                        if: { $ne: ["$video", null] },
                                        then: `${process.env.DOMAIN}`,
                                        else: "$$REMOVE"
                                    }
                                },
                                {
                                    $cond: {
                                        if: { $ne: ["$video", null] },
                                        then: "$video",
                                        else: "$$REMOVE"
                                    }
                                }
                            ]
                        }
                    }
                }
            ]);
            return response;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

}
