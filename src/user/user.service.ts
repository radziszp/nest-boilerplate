import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@user/entities/user.entity';
import { UserObject } from '@user/interfaces';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private sanitizeUserObject(user: UserEntity): UserObject {
    delete user.password;
    return user;
  }

  private comparePasswords(
    currentPassword: string,
    userPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(currentPassword, userPassword);
  }

  async create({ email, password }): Promise<UserObject> {
    let user: UserEntity = this.userRepository.create({ email, password });
    user = await this.userRepository.save(user);

    return this.sanitizeUserObject(user);
  }

  async findByLogin({ email, password }): Promise<UserObject> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException("User doesn't exist");
    }

    if (!(await this.comparePasswords(password, user.password))) {
      throw new UnauthorizedException("Password doesn't match");
    }

    return this.sanitizeUserObject(user);
  }

  async findByPayload({ email }): Promise<UserObject> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return this.sanitizeUserObject(user);
  }

  async findOne(options): Promise<UserObject> {
    const user = await this.userRepository.findOne(options);

    return this.sanitizeUserObject(user);
  }
}
