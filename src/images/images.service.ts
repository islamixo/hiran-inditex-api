import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ImageVariant } from './schemas/image.schema';
import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';
import { ensureDir } from 'src/utils/file.util';
import { md5Hex } from 'src/utils/hash.util';

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel(ImageVariant.name) private readonly imageModel: Model<ImageVariant>,
  ) { }

  async generateVariants(params: {
    buffer: Buffer;
    outputRoot: string;
    baseName: string;
    ext: string;
    taskId: Types.ObjectId;
    widths: number[];
  }) {
    const { buffer, outputRoot, baseName, ext, taskId, widths } = params;

    const outputs: { resolution: number; path: string }[] = [];

    for (const width of widths) {
      const md5 = md5Hex(buffer.toString('binary') + width);
      const outDir = path.join(outputRoot, baseName, String(width));
      await ensureDir(outDir);
      const outPath = path.join(outDir, `${md5}.${ext}`);

      const img = sharp(buffer).resize({ width }).toFormat(ext as any, { quality: 85 });
      await img.toFile(outPath);

      const relPath = path.normalize(path.join('/output', baseName, String(width), `${md5}.${ext}`));
      outputs.push({ resolution: width, path: relPath });

      await this.imageModel.create({ taskId, resolution: width, path: relPath, md5 });
    }

    return outputs;
  }
}
