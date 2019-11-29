import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';
import { LoginUserDTO, RegisterUserDTO, GetUserDTO } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private _userRepository: Repository<UserEntity>
  ) {}

  async getAll(): Promise<GetUserDTO[]> {
    const users = await this._userRepository.find();
    return users.map(user => user.toResponseObj());
  }

  async login(data: LoginUserDTO): Promise<GetUserDTO> {
    const { username, password } = data;
    const user = await this._userRepository.findOne({
      where: {
        username
      }
    });

    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException(
        'Invalid username or pasword',
        HttpStatus.BAD_REQUEST
      );
    }

    return user.toResponseObj(true);
  }

  async register(data: RegisterUserDTO): Promise<GetUserDTO> {
    const { username } = data;
    let user = await this._userRepository.findOne({
      where: {
        username
      }
    });
    if (user) {
      throw new HttpException(
        'The user is already exists',
        HttpStatus.BAD_REQUEST
      );
    }
    user = this._userRepository.create(data);
    await this._userRepository.save(user);

    return user.toResponseObj(true);
  }
}
