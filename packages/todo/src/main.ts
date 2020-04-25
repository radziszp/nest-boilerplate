import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { configuration } from './config/config';
import * as helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function setSwagger(app) {
  const { swagger } = configuration;
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(swagger.title)
    .setDescription(swagger.description)
    .setVersion(swagger.version)
    .addTag(swagger.tag)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule.forRoot());
  setSwagger(app);
  app.useGlobalPipes(new ValidationPipe());
  app.use(helmet());

  await app.listen(configuration.port);
}

bootstrap();
