import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Users, UserSchema } from 'src/Schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Middleware } from 'src/middleware/middleware.middleware';
import { JwtModule } from '@nestjs/jwt';
import { Friend, FriendSchema } from 'src/Schemas/friend.schema';
import { NotificationModule } from '../notification/notification.module';
import { MessageModule } from '../Message/message.module';
import { FriendModule } from '../Friend/friend.module';
import { NewsModule } from '../News/news.module';
// import { News, NewsSchema } from 'src/Schemas/news.schema';
// import { Like, LikeSchema } from 'src/Schemas/like.schema';
// import { Comment, CommentSchema } from 'src/Schemas/comment.schema';
// import { EventsModule } from 'src/Socket/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Users.name, schema: UserSchema },
      {
        name: Friend.name,
        schema: FriendSchema,
      },
      // { name: News.name, schema: NewsSchema },
      // { name: Like.name, schema: LikeSchema },
      // { name: Comment.name, schema: CommentSchema },
    ]),
    JwtModule.register({
      secret: 'reqr2141!@321321*!!@$%',
      signOptions: { expiresIn: '1d' },
    }),
    NotificationModule,
    MessageModule,
    FriendModule,
    forwardRef(() => NewsModule),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(Middleware)
      .forRoutes(
        { path: '/user/uploadAvatar', method: RequestMethod.POST },
        { path: '/user/uploadFileCoverImage', method: RequestMethod.POST },
        { path: '/user/SearchUser', method: RequestMethod.POST },
        { path: '/user/getInforUser', method: RequestMethod.POST },
        { path: '/user/SuggestFriends', method: RequestMethod.POST },
        { path: '/user/GetDataProfile', method: RequestMethod.POST },
      );
  }
}
