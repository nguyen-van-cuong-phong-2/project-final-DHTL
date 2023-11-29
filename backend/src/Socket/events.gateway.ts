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
import { MessageService } from '../Message/message.service';

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
  @SubscribeMessage('sendMessage')
  public async sendMessage(
    @MessageBody()
    data: {
      sender_id: number;
      receiver_id: number;
      content: string;
    },
  ): Promise<any> {
    const id = await this.messageService.getMaxID();
    const created_at = new Date().getTime();
    await this.messageService.createMessage({ id, created_at, ...data });
    return this.server.emit(
      'Message',
      `${data.sender_id} đã gửi tin nhắn đến ${data.receiver_id} với nội dung: ${data.content}`,
    );
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
      return this.server.to(client.id).emit('Message', { data: response });
    }
    return this.server.emit('Message', `Missing data`);
  }
}
