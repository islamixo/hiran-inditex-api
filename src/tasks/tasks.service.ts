import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, TaskStatus } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { config } from 'src/config/configuration';
import { ImagesService } from 'src/images/images.service';
import { readInputToBuffer, getNameAndExt } from 'src/utils/file.util';

@Injectable()
export class TasksService {
  private readonly widths = [1024, 800];
  private readonly outputRoot = config().outputDir;

  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    private readonly imagesService: ImagesService,
  ) {}

  private randomPrice(min = 5, max = 50) {
    const val = Math.random() * (max - min) + min;
    return Math.round(val * 100) / 100;
  }

  async create(dto: CreateTaskDto) {
    const price = this.randomPrice();
    const task = await this.taskModel.create({
      originalPath: dto.input,
      price,
      status: 'pending' as TaskStatus,
      images: [],
    });

    // Procesamiento asíncrono no bloqueante
    setImmediate(async () => {
      try {
        const { buffer } = await readInputToBuffer(dto.input);
        const { name: baseName, ext } = getNameAndExt(dto.input);
        const variants = await this.imagesService.generateVariants({
          buffer,
          outputRoot: this.outputRoot,
          baseName,
          ext,
          taskId: task._id as Types.ObjectId,
          widths: this.widths,
        });
        task.status = 'completed';
        task.images = variants;
        task.error = null;
        await task.save();
      } catch (err: any) {
        task.status = 'failed';
        task.error = err?.message || String(err);
        await task.save();
      }
    });

    return { taskId: task._id.toString(), status: task.status, price: task.price };
  }

  async get(taskId: string) {
    const task = await this.taskModel.findById(taskId).lean();
    if (!task) throw new NotFoundException('Task not found');
    const { _id, status, price, images } = task;
    const res: any = { taskId: _id.toString(), status, price };
    if (status === 'completed') res.images = images;
    if (status === 'failed') res.error = task.error;
    return res;
  }
}
