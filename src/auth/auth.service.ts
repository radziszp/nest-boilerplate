import { UserService } from '@user/user.service';
import { Injectable } from '@nestjs/common';
import { UserObject } from '@user/interfaces';
import { LoginUserDto, CreateUserDto } from '@user/dtos';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<UserObject> {
    return this.userService.create(createUserDto);
  }

  async login(loginUserDto: LoginUserDto): Promise<string> {
    const { email } = await this.userService.findByLogin(loginUserDto);

    return this.jwtService.sign({ email });
  }
}
