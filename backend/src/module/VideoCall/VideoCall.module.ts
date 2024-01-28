import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { VideoCallController } from './VideoCall.controller';
import { VideoCallService } from './VideoCall.service';
import { MongooseModule } from '@nestjs/mongoose';
import { VideoCall, VideoCallSchema } from 'src/Schemas/videoCall.schema';
import { Middleware } from 'src/middleware/middleware.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VideoCall.name, schema: VideoCallSchema },
    ]),
    JwtModule.register({
      secret: 'reqr2141!@321321*!!@$%',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [VideoCallController],
  providers: [VideoCallService],
})
export class VideoCallModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Middleware).forRoutes('VideoCall');
  }
}
