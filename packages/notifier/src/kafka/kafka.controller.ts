import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotifyData, NotifyProvider } from './interfaces';

@Controller()
export class KafkaController {
  constructor(
    @Inject('notify-provider') private readonly notifyProvider: NotifyProvider,
  ) {}

  @EventPattern('notify')
  public async execute(@Payload() { value }: { value: NotifyData }) {
    return this.notifyProvider.send(value);
  }
}
