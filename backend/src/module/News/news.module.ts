import {
  MiddlewareConsumer,
  Module,
  NestModule,
  forwardRef,
} from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { MongooseModule } from '@nestjs/mongoose';
import { News, NewsSchema } from 'src/Schemas/news.schema';
import { JwtModule } from '@nestjs/jwt';
import { Middleware } from 'src/middleware/middleware.middleware';
import { UserModule } from '../User/user.module';
import { FriendModule } from '../Friend/friend.module';
import { Like, LikeSchema } from 'src/Schemas/like.schema';
import { Comment, CommentSchema } from 'src/Schemas/comment.schema';
import { EventsModule } from 'src/Socket/events.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: News.name, schema: NewsSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    JwtModule.register({
      secret: 'reqr2141!@321321*!!@$%',
      signOptions: { expiresIn: '1d' },
    }),
    forwardRef(() => UserModule),
    FriendModule,
    forwardRef(() => EventsModule),
    NotificationModule,
  ],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Middleware).forRoutes('news');
  }
}
