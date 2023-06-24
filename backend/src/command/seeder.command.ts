import { Command } from 'nestjs-command';
import { UserService } from 'src/modules/user/user.service';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SeederCommand {
  constructor(private userService: UserService) {}

  @Command({ command: 'seeder', describe: 'seeder' })
  async create(): Promise<void> {
    try {
      Promise.all([
        this.userService.createRole('admin'),
        this.userService.createRole('operation'),
      ]).then(([adminRole, operationRole]) => {
        Promise.all([
          this.userService.createUser({
            user_name: 'admin',
            password: bcrypt.hashSync('12345', 10),
          }),
          this.userService.createUser({
            user_name: 'operation',
            password: bcrypt.hashSync('12345', 10),
          }),
        ]).then(async ([admin, operation]) => {
          admin.role = adminRole;
          await admin.save();
          operation.role = operationRole;
          await operation.save();
          Promise.all([
            this.userService.createPermission('view_all_user', adminRole),
            this.userService.createPermission('update_user', adminRole),
          ]);
        });
      });
      console.log('run seeder success');
    } catch (err) {
      console.log(err);
    }
  }
}
