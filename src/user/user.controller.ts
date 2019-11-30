import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Delete,
  Param
} from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDTO, RegisterUserDTO, GetUserDTO } from './dto';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { DeleteResult } from 'typeorm';
import { Helper } from 'src/shared/helper';
import { User } from 'src/shared/decorators/user.decorator';

@Controller()
export class UserController {
  helper = Helper.getInstance();
  constructor(private _userService: UserService) {}

  @Get('user')
  @UseGuards(new AuthGuard())
  getAll(): Promise<GetUserDTO[]> {
    return this._userService.getAll();
  }

  @Post('login')
  login(@Body() data: LoginUserDTO): Promise<GetUserDTO> {
    this.helper.logData(data);
    return this._userService.login(data);
  }

  @Post('register')
  register(@Body() data: RegisterUserDTO): Promise<GetUserDTO> {
    this.helper.logData(data);
    return this._userService.register(data);
  }

  @Delete('user/:id')
  deleteUser(@Param() id: string): Promise<DeleteResult> {
    this.helper.logData(id);
    return this._userService.delete(id);
  }

  @Get('user/bookmark')
  @UseGuards(new AuthGuard())
  getAllBookmarks(@User('id') id: string) {
    this.helper.logData(id);
    return this._userService.getAllBookmarks(id);
  }
}
