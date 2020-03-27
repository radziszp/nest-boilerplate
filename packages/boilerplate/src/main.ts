import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { configuration } from './config/config';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule.forRoot());
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());

  await app.listen(configuration.port);
}

bootstrap();
