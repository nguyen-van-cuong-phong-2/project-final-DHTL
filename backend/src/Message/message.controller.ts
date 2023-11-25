import { Controller, Get } from '@nestjs/common';

@Controller('message')
export class MessageController {
  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
