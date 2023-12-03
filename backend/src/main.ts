import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import type { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(8080);
  console.log(`Application is running on port: ${8080}`);
}
bootstrap();
