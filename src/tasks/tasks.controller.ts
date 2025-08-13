import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create an image processing task' })
  @ApiResponse({ status: 201, description: 'Task created' })
  async create(@Body() dto: CreateTaskDto) {
    return this.tasksService.create(dto);
  }

  @Get(':taskId')
  @ApiOperation({ summary: 'Gets the status and result of a task' })
  @ApiResponse({ status: 200 })
  async get(@Param('taskId') taskId: string) {
    return this.tasksService.get(taskId);
  }
}
