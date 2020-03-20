import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoService } from '@todo/todo.service';
import { TodoEntity } from '@todo/entities/todo.entity';
import { TodoController } from '@todo/todo.controller';
import { UserEntity } from '@user/entities/user.entity';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([TodoEntity, UserEntity]),
  ],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
