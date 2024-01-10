import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ReelsController } from './reels.controller';
import { ReelsService } from './reels.service';
import { Middleware } from 'src/middleware/middleware.middleware';
import { UserModule } from '../User/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Reels, ReelsSchema } from 'src/Schemas/reels.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reels.name, schema: ReelsSchema }]),
    UserModule,
    JwtModule.register({
      secret: 'reqr2141!@321321*!!@$%',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [ReelsController],
  providers: [ReelsService],
})
export class ReelsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Middleware).forRoutes('reels');
  }
}
