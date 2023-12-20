import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { MongooseModule } from '@nestjs/mongoose';
import { News, NewsSchema } from 'src/Schemas/news.schema';
import { JwtModule } from '@nestjs/jwt';
import { Middleware } from 'src/middleware/middleware.middleware';
import { UserModule } from '../User/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
    JwtModule.register({
      secret: 'reqr2141!@321321*!!@$%',
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
  ],
  controllers: [NewsController],
  providers: [NewsService],
})
export class NewsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Middleware).forRoutes('news');
  }
}
