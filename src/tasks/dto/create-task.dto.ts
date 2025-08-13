import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateIf } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({ description: 'Local path or URL of the original image' })
  @IsString()
  @ValidateIf((o) => typeof o.input === 'string')
  input!: string; // local path or URL
}
