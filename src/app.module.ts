
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './config/configuration';
import { TasksModule } from './tasks/tasks.module';
import { ImagesModule } from './images/images.modules';

@Module({
  imports: [
    MongooseModule.forRoot(config().mongoUri),
    TasksModule,
    ImagesModule,
  ],
})
export class AppModule {}