import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { configuration } from './config/config';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());

  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [`${configuration.kafka.host}:${configuration.kafka.port}`],
      }
    }
  });

  await app.startAllMicroservicesAsync();
  await app.listen(configuration.port);
}

bootstrap();
