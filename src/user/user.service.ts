import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';

import { UserEntity } from './user.entity';
import { LoginUserDTO, RegisterUserDTO, GetUserDTO } from './dto';
import { IdeaEntity } from 'src/idea/idea.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private _userRepository: Repository<UserEntity>
  ) {}

  async getAll(): Promise<GetUserDTO[]> {
    const users = await this._userRepository.find({
      relations: ['ideas', 'bookmarks']
    });
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

  async delete(id: string): Promise<DeleteResult> {
    const user = await this._userRepository.findOne(id);
    if (!user) {
      throw new HttpException('The user is not found', HttpStatus.NOT_FOUND);
    }

    return await this._userRepository.delete(id);
  }

  async getAllBookmarks(id: string): Promise<IdeaEntity[]> {
    const user = await this._userRepository.findOne(id, {
      relations: ['ideas', 'bookmarks']
    });
    return user.bookmarks;
    // return users.map(user => user.toResponseObj());
  }
}
