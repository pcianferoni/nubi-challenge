/* eslint-disable @typescript-eslint/ban-types */
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const errorMessage = this.formatErrors(errors);
      throw new BadRequestException({
        message: 'Validation failed',
        error: errorMessage,
      });
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: ValidationError[]): string {
    const invalidFields: string[] = [];

    errors.forEach((error) => {
      Object.entries(error.constraints).forEach(([_constraintKey, constraint]) => {
        // Detecta si los campos 'email' o 'password' son inválidos
        if (error.property === 'email' || error.property === 'password') {
          invalidFields.push('email or password are invalid');
        } else {
          // Si no son 'email' o 'password', usa el mensaje predeterminado
          invalidFields.push(constraint);
        }
      });
    });

    return invalidFields.join(', ');
  }
}
