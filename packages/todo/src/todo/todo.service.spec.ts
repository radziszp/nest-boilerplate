import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoService } from '@todo/todo.service';
import { TodoEntity } from '@todo/entities/todo.entity';
import { UserObject } from '@user/interfaces';
import { UserEntity } from '@user/entities/user.entity';
import { UserService } from '@user/user.service';
import { NotFoundException } from '@nestjs/common';
import { NotifyEvent } from '@todo/events/notify.event';
import { KafkaService } from '@kafka/kafka.service';
import { NOTIFY_TYPES } from '@shared/constants';

describe('TodoService', () => {
  let todoService: TodoService;
  let userService: UserService;
  let notifyEvent: NotifyEvent;
  let kafkaService: KafkaService;
  let todoRepo: Repository<TodoEntity>;
  const todo = { id: '1', name: 'name' } as TodoEntity;
  const owner = { id: '1' } as UserObject;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(TodoEntity),
          useFactory: () => ({
            create: () => jest.fn(),
            save: () => jest.fn(),
            findOne: () => jest.fn(),
            find: () => jest.fn(),
            update: () => jest.fn(),
            delete: () => jest.fn(),
          }),
        },
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useClass: Repository,
        },
        NotifyEvent,
        {
          provide: KafkaService,
          useFactory: () => ({
            emit: () => jest.fn(),
          }),
        }
      ],
    }).compile();

    userService = module.get(UserService);
    todoService = module.get(TodoService);
    notifyEvent = module.get(NotifyEvent);
    kafkaService = module.get(KafkaService);
    todoRepo = module.get(getRepositoryToken(TodoEntity));
  });

  describe('create()', () => {
    it('should save todo', async () => {
      const findOneSpy = jest
        .spyOn(userService, 'findOne')
        .mockReturnValue(Promise.resolve(owner));
      const createSpy = jest.spyOn(todoRepo, 'create').mockReturnValue(todo);
      const saveSpy = jest.spyOn(todoRepo, 'save');

      await todoService.create(todo, owner);

      expect(saveSpy).toBeCalledWith(todo);

      findOneSpy.mockRestore();
      createSpy.mockRestore();
      saveSpy.mockRestore();
    });

    it('should call afterCreate method', async () => {
      const findOneSpy = jest
        .spyOn(userService, 'findOne')
        .mockReturnValue(Promise.resolve(owner));
      const saveSpy = jest
        .spyOn(todoRepo, 'save')
        .mockReturnValue(Promise.resolve(todo));
      const afterCreateSpy = jest.spyOn(todoService, 'afterCreate');

      await todoService.create(todo, owner);

      expect(afterCreateSpy).toBeCalledWith(owner, todo);

      findOneSpy.mockRestore();
      saveSpy.mockRestore();
      afterCreateSpy.mockRestore();
    });

    it('should return saved todo', async () => {
      const findOneSpy = jest
        .spyOn(userService, 'findOne')
        .mockReturnValue(Promise.resolve(owner));
      const saveSpy = jest
        .spyOn(todoRepo, 'save')
        .mockReturnValue(Promise.resolve(todo));

      const result = await todoService.create(todo, owner);

      expect(result).toEqual(todo);

      findOneSpy.mockRestore();
      saveSpy.mockRestore();
    });
  });

  describe('findAll()', () => {
    it('should should return todos', async () => {
      const findSpy = jest
        .spyOn(todoRepo, 'find')
        .mockReturnValue(Promise.resolve([todo]));

      const result = await todoService.findAll(owner);

      expect(result).toEqual([todo]);

      findSpy.mockRestore();
    });
  });

  describe('findById()', () => {
    it('should should return todo', async () => {
      const findSpy = jest
        .spyOn(todoRepo, 'findOne')
        .mockReturnValue(Promise.resolve(todo));

      const result = await todoService.findById(todo.id, owner);

      expect(result).toEqual(todo);

      findSpy.mockRestore();
    });

    it('should should throw exception if no todo not found', async () => {
      const findSpy = jest
        .spyOn(todoRepo, 'findOne')
        .mockReturnValue(Promise.resolve(null));

      const result = todoService.findById(todo.id, owner);

      await expect(result).rejects.toBeInstanceOf(NotFoundException);

      findSpy.mockRestore();
    });
  });

  describe('update()', () => {
    it('should should throw exception if todo not found', async () => {
      const findSpy = jest.spyOn(todoRepo, 'findOne').mockReturnValue(null);

      const result = todoService.update(todo.id, todo, owner);

      await expect(result).rejects.toBeInstanceOf(NotFoundException);

      findSpy.mockRestore();
    });

    it('should should update todo', async () => {
      const updateSpy = jest.spyOn(todoRepo, 'update');

      await todoService.update(todo.id, todo, owner);

      expect(updateSpy).toBeCalledWith({ id: todo.id }, todo);

      updateSpy.mockRestore();
    });

    it('should should return todo', async () => {
      const findByIdSpy = jest
        .spyOn(todoService, 'findById')
        .mockReturnValue(Promise.resolve(todo));

      const result = await todoService.update(todo.id, todo, owner);

      expect(result).toEqual(todo);

      findByIdSpy.mockRestore();
    });
  });

  describe('delete()', () => {
    it('should return number of affected records', async () => {
      const deleteResult = { affected: 1, raw: 'raw' };
      const deleteSpy = jest
        .spyOn(todoRepo, 'delete')
        .mockReturnValue(Promise.resolve(deleteResult));

      const result = await todoService.delete(todo.id, owner);

      expect(result).toEqual({ affected: deleteResult.affected });

      deleteSpy.mockRestore();
    });
  });

  describe('afterCreate()', () => {
    it('should execute notifyEvent', () => {
      const data = {
        subject: "You've created new todo",
        message: `Congratulations you've created new todo ${todo.name}`,
      };
      const executeSpy = jest.spyOn(notifyEvent, 'execute');

      todoService.afterCreate(owner, todo);

      expect(executeSpy).toBeCalledWith(NOTIFY_TYPES.EMAIl, owner, data);

      executeSpy.mockRestore();
    });
  });
});
