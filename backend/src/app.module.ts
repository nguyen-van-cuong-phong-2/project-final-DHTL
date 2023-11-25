import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './Socket/events.module';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    EventsModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/ProjectFinal'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
