/* eslint-disable @typescript-eslint/ban-types */
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    
    if (errors.length > 0) {
      console.log(
        '🚀 ~ file: validation.pipe.ts:21 ~ ValidationPipe ~ transform ~ errors:',
        errors,
      );
      throw new BadRequestException('Validation failed');
    }

    if (value.userName && value.userName.includes('@')) {
      const gmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!gmailRegex.test(value.userName)) {
        throw new BadRequestException('Invalid Email');
      }
    } else if (value.userName && !value.userName.includes('@')) {
      const phoneNumberRegex = /^(?:\+84|0|\+1)?([1-9][0-9]{8,9})$/;
      if (!phoneNumberRegex.test(value.userName)) {
        throw new BadRequestException('Invalid PhoneNumber');
      }
    } else if (value.id) {
      value.id = Number(value.id);
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
