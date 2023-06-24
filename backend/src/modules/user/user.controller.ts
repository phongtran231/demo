import {
  Body,
  Controller,
  Get,
  HttpCode,
  Request,
  Post,
  UseGuards,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Permission } from 'src/decorators/permission.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() body) {
    return this.userService.login(body);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@Request() request) {
    return request.user;
  }

  @Get('view-all')
  @Permission('view_all_user')
  async listUser(@Res() res) {
    const data = await this.userService.getUsers();
    if (data.error) {
      return res.status(400).json({ error: true });
    }
    return res.status(200).json({
      error: false,
      data: data.data,
    });
  }
}
