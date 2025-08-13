import * as dotenv from 'dotenv';
dotenv.config();

export const config = () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/image_tasks_db',
  outputDir: process.env.OUTPUT_DIR || './output',
  inputDir: process.env.INPUT_DIR || './input',
});
