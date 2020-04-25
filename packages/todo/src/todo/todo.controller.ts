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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam
} from '@nestjs/swagger';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Todo has been successfully created.' })
  @ApiBadRequestResponse({ description: 'Malformed request.' })
  @UseGuards(AuthGuard())
  create(@Body() todoCreateDto: TodoCreateDto, @User() user: UserObject) {
    return this.todoService.create(todoCreateDto, user);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOkResponse()
  @UseGuards(AuthGuard())
  findAll(@User() user: UserObject) {
    return this.todoService.findAll(user);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Todo\'s ID' })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @UseGuards(AuthGuard())
  findById(@Param('id') id, @User() user: UserObject) {
    return this.todoService.findById(id, user);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Todo\'s ID' })
  @ApiBadRequestResponse({ description: 'Malformed request.' })
  @ApiOkResponse()
  @ApiNotFoundResponse()
  @UseGuards(AuthGuard())
  update(
    @Param('id') id,
    @Body() todoCreateDto: TodoCreateDto,
    @User() user: UserObject,
  ) {
    return this.todoService.update(id, todoCreateDto, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Todo\'s ID' })
  @ApiOkResponse()
  @UseGuards(AuthGuard())
  delete(@Param('id') id, @User() user: UserObject) {
    return this.todoService.delete(id, user);
  }
}
