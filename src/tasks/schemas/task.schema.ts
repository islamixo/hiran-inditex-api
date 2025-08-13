import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TaskStatus = 'pending' | 'completed' | 'failed';

@Schema({ timestamps: true, versionKey: false })
export class Task {
  _id!: Types.ObjectId;

  @Prop({ required: true })
  originalPath!: string; // local path or URL

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ required: true, enum: ['pending', 'completed', 'failed'], index: true })
  status!: TaskStatus;

  @Prop({ type: [{ resolution: Number, path: String }], default: [] })
  images!: { resolution: number; path: string }[];

  @Prop({ type: String, default: null })
  error?: string | null;
}

export type TaskDocument = HydratedDocument<Task>;
export const TaskSchema = SchemaFactory.createForClass(Task);
TaskSchema.index({ createdAt: -1 });
