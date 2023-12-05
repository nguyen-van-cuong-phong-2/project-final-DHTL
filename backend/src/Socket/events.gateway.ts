import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from '../module/Message/message.service';
import { UsePipes, ValidationPipe } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayDisconnect, OnGatewayConnection {
  private arrUserOnline = new Map();
  constructor(private readonly messageService: MessageService) {}
  handleConnection(client: any) {
    console.log(`${client.id} connected`);
  }
  @WebSocketServer()
  server: Server;

  handleDisconnect(client: Socket) {
    this.arrUserOnline.delete(client.id);
  }

  @SubscribeMessage('login')
  login(@MessageBody() data: number, @ConnectedSocket() client: Socket): void {
    console.log(this.arrUserOnline.set(client.id, data));
  }

  @SubscribeMessage('getOnline')
  getOnline(): void {
    this.server.emit('getOnline', this.arrUserOnline);
  }

  // gửi tin nhắn
  // @UsePipes(new ValidationPipe())
  @SubscribeMessage('sendMessage')
  public async sendMessage(
    @MessageBody()
    data: {
      sender_id: number;
      receiver_id: number;
      content: string;
    },
  ): Promise<any> {
    const result = await this.messageService.createMessage(data);
    return this.server.emit('Message', result);
  }

  // lấy tin nhắn
  @SubscribeMessage('getMessage')
  async getgetMessage(
    @MessageBody()
    data: {
      sender_id: number;
      receiver_id: number;
    },
    @ConnectedSocket() client: Socket,
  ): Promise<any> {
    if (data.sender_id && data.receiver_id) {
      const response = await this.messageService.getMessage(data);
      this.server.socketsJoin(client.id);
      return this.server.to(client.id).emit('PushMessage', { data: response });
    }
    return this.server.emit('Message', `Missing data`);
  }
}
