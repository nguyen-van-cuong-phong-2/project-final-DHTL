import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from '../Message/message.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayDisconnect {
  private arrUserOnline = new Map();
  constructor(private readonly messageService: MessageService) {}
  @WebSocketServer()
  server: Server;

  handleDisconnect(client: Socket) {
    this.arrUserOnline.delete(client.id);
  }

  @SubscribeMessage('login')
  login(@MessageBody() data: number, @ConnectedSocket() client: Socket): void {
    this.arrUserOnline.set(client.id, data);
  }

  @SubscribeMessage('getOnline')
  getOnline(): void {
    this.server.emit('getOnline', this.arrUserOnline);
  }

  // gửi tin nhắn
  @SubscribeMessage('sendMessage')
  async sendMessage(
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
}
