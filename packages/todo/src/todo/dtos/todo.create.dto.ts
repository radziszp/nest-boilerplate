import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsUnique } from '@shared/validators';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class TodoCreateDto {
  @ApiPropertyOptional({ description: 'Todo\'s name' })
  @IsNotEmpty()
  @IsString()
  @IsUnique(
    { table: 'todos', column: 'name' },
    { message: 'Todo $value already exits' },
  )
  name: string;

  @ApiPropertyOptional({ description: 'Todo\'s description' })
  @IsOptional()
  @IsString()
  description?: string;
}
