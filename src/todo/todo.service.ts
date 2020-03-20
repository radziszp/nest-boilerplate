import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity } from '@todo/entities/todo.entity';
import { TodoCreateDto } from '@todo/dtos';
import { UserObject } from '@user/interfaces';
import { UserService } from '@user/user.service';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
    private readonly userService: UserService,
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

    return this.todoRepository.save(todo);
  }

  findAll(owner: UserObject): Promise<TodoEntity[]> {
    return this.todoRepository.find({ owner });
  }

  async findById(id, owner: UserObject): Promise<TodoEntity> {
    const todo = this.todoRepository.findOne({ id, owner });
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

  async delete(id, owner: UserObject) {
    const { affected } = await this.todoRepository.delete({ id, owner });

    return affected;
  }
}
