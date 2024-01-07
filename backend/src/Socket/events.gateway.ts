/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { UserService } from '../module/User/user.service';
import { NotificationService } from '../module/notification/notification.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayDisconnect, OnGatewayConnection {
  private arrUserOnline = new Map();
  constructor(
    private readonly messageService: MessageService,
    private readonly UserService: UserService,
    private readonly NotificationService: NotificationService,
  ) { }
  handleConnection(client: any) {
    // console.log(`${client.id} connected`);
    // this.arrUserOnline.set(27, client.id);
  }
  @WebSocketServer()
  public server: Server;

  handleDisconnect(client: Socket) {
    this.arrUserOnline.forEach(async (value, key) => {
      if (value === client.id) {
        await this.UserService.LastOnline(key);
        this.arrUserOnline.delete(key);
        this.server.emit('userOffline', { id: key, time: new Date().getTime() });
        const values = Array.from(this.arrUserOnline.keys());
        this.server.emit('listOnline', values);
      }
    });
  }

  @SubscribeMessage('login')
  login(
    @MessageBody() data: { id: number },
    @ConnectedSocket() client: Socket,
  ): void {
    this.arrUserOnline.set(data.id, client.id);
    const values = Array.from(this.arrUserOnline.keys());
    this.server.emit('listOnline', values);
  }

  @SubscribeMessage('getOnline')
  getOnline(): void {
    const values = Array.from(this.arrUserOnline.keys());
    this.server.emit('listOnline', values);
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
    @ConnectedSocket() client: Socket,
  ): Promise<any> {
    const find = this.arrUserOnline.get(data.receiver_id);
    const result = await this.messageService.createMessage(data);
    return this.server.to(client.id).to(find).emit('Message', result);
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
      return this.server.to(client.id).emit('PushMessage', { data: response });
    }
    return this.server.to(client.id).emit('Message', `Missing data`);
  }

  // send friend request
  @SubscribeMessage('sendNotification')
  async sendNotification(
    @MessageBody()
    data: {
      sender_id: number;
      receiver_id: number;
      type: number;
      type_enmoji?: number;
    },
  ): Promise<any> {
    const find = this.arrUserOnline.get(data.receiver_id);
    if (find) {
      const response_Promise = this.UserService.getInfoUser(data.sender_id);
      const totalNotifi_Promise = this.NotificationService.getTotalNotification(
        data.receiver_id,
      );
      const [response, totalNotifi] = await Promise.all([
        response_Promise,
        totalNotifi_Promise,
      ]);
      return this.server.to(find).emit('notification', {
        data: {
          sender_id: response,
          type: data.type,
          totalNotifi,
          type_enmoji: data.type_enmoji,
        },
      });
    }
  }

  @SubscribeMessage('typingMessage')
  async typePingMessage(
    @MessageBody()
    data: {
      sender_id: number;
      receiver_id: number;
      type: number;
    },
  ): Promise<any> {
    const id_chat = this.arrUserOnline.get(data.receiver_id);
    return this.server
      .to(id_chat)
      .emit('typing', { sender_id: data.sender_id, type: data.type });
  }
}
