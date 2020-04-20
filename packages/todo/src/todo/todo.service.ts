import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity } from '@todo/entities/todo.entity';
import { TodoCreateDto } from '@todo/dtos';
import { UserObject } from '@user/interfaces';
import { UserService } from '@user/user.service';
import { NotifyEvent } from '@todo/events/notify.event';
import { NOTIFY_TYPES } from '@shared/constants';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
    private readonly userService: UserService,
    private readonly notifyEvent: NotifyEvent,
  ) {}

  async create(
    todoCreateDto: TodoCreateDto,
    user: UserObject,
  ): Promise<TodoEntity> {
    const owner = await this.userService.findOne({ id: user.id });
    const todo: TodoEntity = this.todoRepository.create({
      ...todoCreateDto,
      owner,
    });

    const savedTodo = await this.todoRepository.save(todo);
    if (savedTodo) {
      this.afterCreate(user, savedTodo);
    }
    return savedTodo;
  }

  findAll(owner: UserObject): Promise<TodoEntity[]> {
    return this.todoRepository.find({ owner });
  }

  async findById(id, owner: UserObject): Promise<TodoEntity> {
    const todo = await this.todoRepository.findOne({ id, owner });
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return todo;
  }

  async update(
    id,
    todoCreateDto: TodoCreateDto,
    owner: UserObject,
  ): Promise<TodoEntity> {
    const todo: TodoEntity = await this.todoRepository.findOne({ id, owner });
    if (!todo) {
      throw new NotFoundException("Todo doesn't exists");
    }

    await this.todoRepository.update({ id }, todoCreateDto);

    return this.findById(id, owner);
  }

  async delete(id, owner: UserObject): Promise<{ affected: number }> {
    const { affected } = await this.todoRepository.delete({ id, owner });

    return { affected };
  }

  afterCreate(user: UserObject, todo: TodoEntity): void {
    const data = {
      subject: "You've created new todo",
      message: `Congratulations you've created new todo ${todo.name}`,
    };

    this.notifyEvent.execute(NOTIFY_TYPES.EMAIl, user, data);
  }
}
