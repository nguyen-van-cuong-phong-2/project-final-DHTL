import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from 'src/Message/Schemas/message.schema';
import { CreateMessageDto } from './dto/create_message.dto';

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

  async getMaxID(): Promise<number> {
    const response = await this.messageModel
      .findOne({}, { id: 1 })
      .sort({ id: -1 })
      .lean();
    const maxID = response?.id !== undefined ? response.id + 1 : 1;
    return maxID;
  }
}
