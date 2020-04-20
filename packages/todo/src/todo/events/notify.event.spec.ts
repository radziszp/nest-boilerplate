import { Test, TestingModule } from '@nestjs/testing';
import { UserObject } from '@user/interfaces';
import { NotifyEvent } from '@todo/events/notify.event';
import { KafkaService } from '@kafka/kafka.service';
import { KAFKA_TOPICS, NOTIFY_TYPES } from '@shared/constants';

describe('NotifyEvent', () => {
  let kafkaService: KafkaService;
  let notifyEvent: NotifyEvent;
  const user = { id: '1' } as UserObject;
  const type = NOTIFY_TYPES.EMAIl;
  const data = { message: 'message' };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotifyEvent,
        {
          provide: KafkaService,
          useFactory: () => ({
            emit: () => jest.fn(),
          }),
        }
      ],
    }).compile();

    notifyEvent = module.get(NotifyEvent);
    kafkaService = module.get(KafkaService);
  });

  describe('execute()', () => {
    it('should emit kafka message', () => {
      const emitSpy = jest.spyOn(kafkaService, 'emit');

      notifyEvent.execute(type, user, data);

      expect(emitSpy).toBeCalledWith(KAFKA_TOPICS.NOTIFY, { type, user, data });

      emitSpy.mockRestore();
    });
  });
});
