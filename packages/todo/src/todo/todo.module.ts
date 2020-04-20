import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoService } from '@todo/todo.service';
import { TodoEntity } from '@todo/entities/todo.entity';
import { TodoController } from '@todo/todo.controller';
import { UserEntity } from '@user/entities/user.entity';
import { UserModule } from '@user/user.module';
import { AuthModule } from '@auth/auth.module';
import { KafkaModule } from '@kafka/kafka.module';
import { NotifyEvent } from '@todo/events/notify.event';

@Module({
  imports: [
    AuthModule,
    UserModule,
    TypeOrmModule.forFeature([TodoEntity, UserEntity]),
    KafkaModule.register(),
  ],
  controllers: [TodoController],
  providers: [TodoService, NotifyEvent],
})
export class TodoModule {}
