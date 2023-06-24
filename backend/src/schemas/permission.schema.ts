import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Role } from './role.schema';
import mongoose from 'mongoose';

@Schema({ collection: 'permissions' })
export class Permission {
  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Role' })
  role: Role;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
