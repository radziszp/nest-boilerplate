import { UserEntity } from '@user/entities/user.entity';

export type UserObject = Omit<UserEntity, 'password'>;
