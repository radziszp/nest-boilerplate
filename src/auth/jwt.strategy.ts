import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from '@user/user.service';
import { JwtPayload } from '@auth/interfaces';
import { UserObject } from '@user/interfaces';
import { configuration } from '../config/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuration.jwtKey,
    });
  }

  async validate(payload: JwtPayload): Promise<UserObject> {
    return this.userService.findByPayload(payload);
  }
}
