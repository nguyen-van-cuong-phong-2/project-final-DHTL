import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from 'src/Message/Schemas/message.schema';
import { CreateMessageDto } from './dto/create_message.dto';
import { GetMessageDto } from './dto/get_message.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  // tạo tin nhắn
  async createMessage(createMessageDto: CreateMessageDto): Promise<string> {
    await this.messageModel.create(createMessageDto);
    return createMessageDto.content;
  }

  // lấy id lớn nhất
  async getMaxID(): Promise<number> {
    const response = await this.messageModel
      .findOne({}, { id: 1 })
      .sort({ id: -1 })
      .lean();
    const maxID = response?.id !== undefined ? response.id + 1 : 1;
    return maxID;
  }

  async getMessage(getMessageDto: GetMessageDto): Promise<any[]> {
    const arr = await this.messageModel
      .find({
        $or: [
          {
            sender_id: getMessageDto.sender_id,
            receiver_id: getMessageDto.receiver_id,
          },
          {
            receiver_id: getMessageDto.sender_id,
            sender_id: getMessageDto.receiver_id,
          },
        ],
      })
      .sort({ created_at: -1 })
      .limit(50)
      .lean();
    const responseArr = arr.reverse();
    const lengArr = responseArr.length;
    for (let i = lengArr - 1; i >= 0; i--) {
      const element: any = responseArr[i];
      if (element.seen === 1) {
        element.messageLastSeen = true;
        break;
      }
    }
    return arr;
  }
}
