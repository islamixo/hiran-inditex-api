import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ImageVariant } from './schemas/image.schema';

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel(ImageVariant.name) private readonly imageModel: Model<ImageVariant>,
  ) {}

  
}
