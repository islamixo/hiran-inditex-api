
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './config/configuration';

@Module({
  imports: [
    MongooseModule.forRoot(config().mongoUri),
  ],
})
export class AppModule {}