import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ description: 'User\'s password' })
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @ApiProperty({ description: 'User\'s email', example: 'e@mail.pl' })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;
}
