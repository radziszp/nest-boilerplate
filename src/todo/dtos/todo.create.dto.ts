import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IsUnique } from '@shared/validators';

export class TodoCreateDto {
  @IsNotEmpty()
  @IsString()
  @IsUnique(
    { table: 'todos', column: 'name' },
    { message: 'Todo $value already exits' },
  )
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
