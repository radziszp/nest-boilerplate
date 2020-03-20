import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { IsUnique } from '@shared/validators';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @IsUnique(
    { table: 'users', column: 'email' },
    { message: 'User already exits' },
  )
  email: string;
}
