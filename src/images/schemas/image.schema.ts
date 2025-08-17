import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: false}, versionKey: false})
export class ImageVariant {
    _id!:  Types.ObjectId;

    @Prop({type: Types.ObjectId, ref: 'Task', index: true, required: true })
    taskId!: Types.ObjectId;

    @Prop({ required: true })
    path!: string;

    @Prop({required: true, index: true})
    resolution!: number;

    @Prop({ required: true, index: true })
    md5!: string;
}

export type ImageVariantDocument = HydratedDocument<ImageVariant>;
export const ImageVariantSchema =  SchemaFactory.createForClass(ImageVariant);
ImageVariantSchema.index({ taskId: 1, resolution: 1 }, { unique: false });
