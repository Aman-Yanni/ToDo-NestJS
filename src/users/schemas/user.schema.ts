import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ToDo } from 'src/todos/schemas/todo.schema';

export type UserDoc = User & Document;

@Schema()
export class User {
    @Prop({
        type: Types.ObjectId,
        unique: true
    })
    userId: Types.ObjectId;

    @Prop({
        // unique: true,
        type: String,
    })
    email: string;

    @Prop({
        unique: true,
        type: String,
    })
    username: string;

    @Prop()
    password?: string;

    // @Prop({ type: [Types.ObjectId], ref: ToDo.name, nullable: true })
    // todos: ToDo[]
}

export const UserSchema = SchemaFactory.createForClass(User);
