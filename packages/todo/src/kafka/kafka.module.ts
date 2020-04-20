import { DynamicModule, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaService } from './kafka.service';
import { configuration } from '../config/config';
import { ClientProviderOptions } from '@nestjs/microservices/module/interfaces/clients-module.interface';

@Module({})
export class KafkaModule {
  static register(): DynamicModule {
    const moduleProperties = KafkaModule.getModuleProperties();
    return {
      module: KafkaModule,
      imports: [
        ClientsModule.register([
          moduleProperties,
        ]),
      ],
      controllers: [],
      providers: [KafkaService],
      exports: [KafkaService],
    }
  }

  static getModuleProperties(): ClientProviderOptions {
    if (process.env.CI) {
      return {
        name: 'kafka-module',
      };
    }

    return {
      name: 'kafka-module',
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [`${configuration.kafka.host}:${configuration.kafka.port}`],
        },
      },
    };
  }
}
