import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SeederCommand } from 'src/command/seeder.command';
import { Role, RoleSchema } from 'src/schemas/role.schema';
import { Permission, PermissionSchema } from 'src/schemas/permission.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
  controllers: [UserController],
  providers: [SeederCommand, UserService],
  exports: [UserService],
})
export class UserModule {}
