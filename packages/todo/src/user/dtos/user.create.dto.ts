import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { IsUnique } from '@shared/validators';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User\'s password' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ description: 'User\'s email', example: 'e@mail.pl' })
  @IsNotEmpty()
  @IsEmail()
  @IsUnique(
    { table: 'users', column: 'email' },
    { message: 'User already exits' },
  )
  email: string;
}
