import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageVariant, ImageVariantSchema } from './schemas/image.schema';
import { ImagesService } from './images.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: ImageVariant.name, schema: ImageVariantSchema }])],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
