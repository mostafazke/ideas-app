import { Controller, Post, Get, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDTO, RegisterUserDTO, GetUserDTO } from './dto';

@Controller()
export class UserController {
  constructor(private _userService: UserService) {}

  @Get('user')
  getAll(): Promise<GetUserDTO[]> {
    return this._userService.getAll();
  }

  @Post('login')
  login(@Body() data: LoginUserDTO): Promise<GetUserDTO> {
    return this._userService.login(data);
  }

  @Post('register')
  register(@Body() data: RegisterUserDTO): Promise<GetUserDTO> {
    return this._userService.register(data);
  }
}
