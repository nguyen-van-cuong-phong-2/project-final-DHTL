import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayDisconnect {
  private arrUserOnline = new Map();
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
    console.log(this.arrUserOnline);
    this.server.emit('getOnline', this.arrUserOnline);
  }
}
