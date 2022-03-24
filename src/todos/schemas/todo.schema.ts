import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TodoDoc = ToDo & Document;
@Schema()
export class ToDo {
    @Prop({
        type: Types.ObjectId,
        unique: true
    })
    id: Types.ObjectId;

    @Prop()
    content: string;

    @Prop()
    completion: boolean;

    @Prop({
        required: true
    })
    userId: Types.ObjectId
}

export const TodoSchema = SchemaFactory.createForClass(ToDo);
