import { Test } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksService } from '../src/tasks/tasks.service';
import { Task, TaskSchema } from '../src/tasks/schemas/task.schema';
import { ImagesModule } from '../src/images/images.modules';

describe('TasksService', () => {
  let service: TasksService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(process.env.MONGODB_URI!),
        MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
        ImagesModule,
      ],
      providers: [TasksService],
    }).compile();

    service = moduleRef.get(TasksService);
  });

  it('create task and process variants', async () => {
    const dto = { input: 'sample.png' } as any;
    const result = await service.create(dto);

    expect(result.taskId).toBeDefined();
    expect(result.status).toBe('pending');
    expect(result.price).toBeGreaterThanOrEqual(5);

    // Wait for setImmediate to process
    await new Promise((r) => setTimeout(r, 300));

    const full = await service.get(result.taskId);
    expect(full.status === 'completed' || full.status === 'failed').toBeTruthy();
    if (full.status === 'completed') {
      expect(full.images).toHaveLength(2);
    }
  });
});
