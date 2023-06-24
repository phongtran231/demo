import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Permission } from './permission.schema';

@Schema({ collection: 'roles' })
export class Role {
  @Prop()
  name: string;

  @Prop()
  permissions: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
