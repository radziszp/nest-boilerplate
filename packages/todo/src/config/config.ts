import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';

function getPostgresDb(): TypeOrmModuleOptions {
  function getSynchronize(): boolean {
    const env = process.env.DATABASES_POSTGRES_SYNCHRONIZE;
    return typeof env === 'undefined' || env.toLowerCase() === 'true';
  }

  function getEntities(): string[] {
    const env = process.env.DATABASES_POSTGRES_ENTITIES;
    return env ? env.split(',') : ['src/**/*.entity{.ts,.js}'];
  }

  return {
    type: 'postgres',
    host: process.env.DATABASES_POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.DATABASES_POSTGRES_PORT, 10) || 5432,
    username: process.env.DATABASES_POSTGRES_USERNAME || 'todo',
    password: process.env.DATABASES_POSTGRES_PASSWORD || 'todo',
    database: process.env.DATABASES_POSTGRES_DATABASE || 'todo',
    entities: getEntities(),
    synchronize: getSynchronize(),
  };
}

export const configuration = {
  port: parseInt(process.env.PORT, 10) | 3000,
  jwtKey: process.env.JWTKEY || 'secret',
  databases: {
    postgres: getPostgresDb(),
  },
};
