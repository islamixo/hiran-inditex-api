import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import slugify from 'slugify';

export async function ensureDir(dir: string) {
  await fs.promises.mkdir(dir, { recursive: true });
}

export function getNameAndExt(inputPath: string) {
  const base = path.basename(inputPath);
  const ext = path.extname(base).replace('.', '') || 'jpg';
  const name = slugify(base.replace(/\.[^.]+$/, ''), { lower: true, strict: true });
  return { name, ext };
}

export async function readInputToBuffer(input: string): Promise<{ buffer: Buffer; originalPath: string; ext: string; baseName: string }>{ 
  let buffer: Buffer;
  if (/^https?:\/\//i.test(input)) {
    const res = await axios.get<ArrayBuffer>(input, { responseType: 'arraybuffer' });
    buffer = Buffer.from(res.data);
  } else {
    buffer = await fs.promises.readFile(input);
  }
  const { name: baseName, ext } = getNameAndExt(input);
  return { buffer, originalPath: input, ext, baseName };
}
