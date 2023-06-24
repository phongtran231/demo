import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Role } from './role.schema';

@Schema({ collection: 'users' })
export class User {
  @Prop()
  user_name: string;

  @Prop()
  password: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
  role: Role;
}
export const UserSchema = SchemaFactory.createForClass(User);
