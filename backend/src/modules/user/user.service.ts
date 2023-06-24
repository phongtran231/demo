import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/schemas/role.schema';
import { Permission } from 'src/schemas/permission.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Role.name) private roleModel: Model<Role>,
    @InjectModel(Permission.name) private permissionModel: Model<Permission>,
    private jwtService: JwtService,
  ) {}
  async login(payload: LoginDto) {
    const user = await this.userModel.findOne({ user_name: payload.user_name });
    await user.populate({ path: 'role', select: '_id, name' });
    if (!user) {
      throw new UnauthorizedException();
    }
    if (!bcrypt.compareSync(payload.password, user.password)) {
      throw new UnauthorizedException();
    }
    return {
      error: false,
      data: {
        token: this.jwtService.sign({
          _id: user._id,
          user_name: payload.user_name,
          role: user.role,
        }),
      },
    };
  }

  createRole(name: string) {
    return this.roleModel.create({
      name,
    });
  }

  createUser(payload) {
    return this.userModel.create(payload);
  }

  getRole(roleId: string) {
    return this.roleModel.findOne({ _id: roleId });
  }

  createPermission(name: string, role: Role) {
    return this.permissionModel.create({
      name,
      role,
    });
  }

  getPermissionsByRole(role) {
    return this.permissionModel.find({ role });
  }

  async getUsers() {
    try {
      const users = await this.userModel
        .find({}, { _id: true, user_name: true })
        .populate({ path: 'role', select: 'name' });
      return {
        error: false,
        data: users,
      };
    } catch {
      return {
        error: true,
      };
    }
  }
}
