import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';
import { getManager } from 'typeorm';

@ValidatorConstraint({ async: true })
export class IsUniqueValidator implements ValidatorConstraintInterface {
  async validate(columnNameValue: any, args: ValidationArguments) {
    const params = args.constraints[0];
    const result = await getManager().query(
      `SELECT * FROM ${params.table} WHERE ${params.column} = '${columnNameValue}'`,
    );

    return !result[0];
  }
}

export function IsUnique(params: {}, validationOptions?: ValidationOptions) {
  return function(object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [params],
      validator: IsUniqueValidator,
    });
  };
}
