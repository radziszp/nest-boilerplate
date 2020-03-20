import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';
import { configuration } from './config/config';
import { AppController } from './app.controller';
import { TodoModule } from '@todo/todo.module';

@Module({})
export class AppModule {
  static forRoot(): DynamicModule {
    return {
      module: AppModule,
      controllers: [AppController],
      imports: [
        TypeOrmModule.forRoot(configuration.databases.postgres),
        AuthModule,
        UserModule,
        TodoModule,
      ],
    };
  }
}
