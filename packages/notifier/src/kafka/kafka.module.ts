import { Module, NotImplementedException } from '@nestjs/common';
import { KafkaController } from './kafka.controller';
import { CONTEXT, RequestContext } from '@nestjs/microservices';
import { EmailProvider } from './notify-providers';

@Module({
  controllers: [KafkaController],
  providers: [
    {
      provide: 'notify-provider',
      useFactory: (context: RequestContext) => {
        const { type } = context.getData().value;
        switch (type) {
          case 'email':
            return new EmailProvider();
          default:
            throw new NotImplementedException(`Type ${type} hasn't been implemented`);
        }
      },
      inject: [CONTEXT],
    }
  ]
})
export class KafkaModule {
}
