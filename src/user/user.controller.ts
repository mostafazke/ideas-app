import { Controller, Post, Get, Body, UseGuards, Delete, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDTO, RegisterUserDTO, GetUserDTO } from './dto';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { DeleteResult } from 'typeorm';

@Controller()
export class UserController {
  constructor(private _userService: UserService) {}

  @Get('user')
  @UseGuards(new AuthGuard())
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

  @Delete('user/:id')
  deleteUser(@Param() id: string): Promise<DeleteResult> {
    return this._userService.delete(id);
  }
}
