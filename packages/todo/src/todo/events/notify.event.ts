import { Injectable } from '@nestjs/common';
import { KafkaService } from '@kafka/kafka.service';
import { UserObject } from '@user/interfaces';
import { KAFKA_TOPICS } from '@shared/constants';

@Injectable()
export class NotifyEvent {
  constructor(
    private readonly kafkaService: KafkaService,
  ) {}

  execute(type: string, user: UserObject, data: any) {
    this.kafkaService.emit(KAFKA_TOPICS.NOTIFY, { type, user, data });
  }
}
