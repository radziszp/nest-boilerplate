import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from '@todo/todo.service';
import { AuthGuard } from '@nestjs/passport';
import { TodoCreateDto } from '@todo/dtos';
import { UserObject } from '@user/interfaces';
import { User } from '@shared/decorators';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @UseGuards(AuthGuard())
  create(@Body() todoCreateDto: TodoCreateDto, @User() user: UserObject) {
    return this.todoService.create(todoCreateDto, user);
  }

  @Get()
  @UseGuards(AuthGuard())
  findAll(@User() user: UserObject) {
    return this.todoService.findAll(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  findById(@Param('id') id, @User() user: UserObject) {
    return this.todoService.findById(id, user);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  update(
    @Param('id') id,
    @Body() todoCreateDto: TodoCreateDto,
    @User() user: UserObject,
  ) {
    return this.todoService.update(id, todoCreateDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  delete(@Param('id') id, @User() user: UserObject) {
    return this.todoService.delete(id, user);
  }
}
