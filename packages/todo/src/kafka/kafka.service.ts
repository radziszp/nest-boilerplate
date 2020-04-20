import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService {
  constructor(
    @Inject('kafka-module') private readonly client: ClientKafka,
  ) {}

  public emit(pattern: string, data: any) {
    return this.client.emit(pattern, data);
  }
}
