import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserObject } from '@user/interfaces';
import { LoginUserDto, CreateUserDto } from '@user/dtos';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({ description: 'User has been successfully created.' })
  @ApiBadRequestResponse({ description: 'Malformed request.' })
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiCreatedResponse({ description: 'User has been successfully logged.' })
  @ApiBadRequestResponse({ description: 'Malformed request.' })
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('whoami')
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({ description: 'User not logged in.' })
  @ApiOkResponse()
  @UseGuards(AuthGuard())
  async whoami(@Req() req): Promise<UserObject> {
    return req.user;
  }
}
