import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserObject } from '@user/interfaces';
import { LoginUserDto, CreateUserDto } from '@user/dtos';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('whoami')
  @UseGuards(AuthGuard())
  async whoami(@Req() req): Promise<UserObject> {
    return req.user;
  }
}
