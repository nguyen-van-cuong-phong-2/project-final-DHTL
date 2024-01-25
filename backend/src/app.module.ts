import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './Socket/events.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './module/User/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { NewsModule } from './module/News/news.module';
import { FriendModule } from './module/Friend/friend.module';
import { NotificationModule } from './module/notification/notification.module';
import { MessageModule } from './module/Message/message.module';
import { ReelsModule } from './module/Reels/reels.module';
import { VideoCallModule } from './module/VideoCall/VideoCall.module';
// 'mongodb://nguyencuong:nguyencuong@localhost:27017',

@Module({
  imports: [
    EventsModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/ProjectFinal'),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'storage'),
    }),
    UserModule,
    NewsModule,
    FriendModule,
    NotificationModule,
    MessageModule,
    ReelsModule,
    VideoCallModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
