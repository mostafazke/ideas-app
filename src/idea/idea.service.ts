import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IdeaEntity } from './idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateIdeaDto, UpdateIdeaDto, GetIdeaDTO } from './dto';
import { UserEntity } from 'src/user/user.entity';
import { GetUserDTO } from 'src/user/dto';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private _ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private _userRepository: Repository<UserEntity>
  ) {}

  private toResponseObject(idea: IdeaEntity) {
    const res: any = { ...idea, author: idea.author.toResponseObj() };
    if (res.upvotes) {
      res.upvotes = idea.upvotes.length;
    }
    if (res.downvotes) {
      res.downvotes = idea.downvotes.length;
    }
    return res;
  }

  async readAll(): Promise<GetIdeaDTO[]> {
    const ideas = await this._ideaRepository.find({
      relations: ['author', 'upvotes', 'downvotes']
    });
    return ideas.map(idea => this.toResponseObject(idea));
  }

  async create(ideaObj: CreateIdeaDto, userId: string): Promise<GetIdeaDTO> {
    const user = await this._userRepository.findOne(userId);
    if (!user) {
      throw new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED);
    }
    const idea = this._ideaRepository.create({ ...ideaObj, author: user });
    await this._ideaRepository.save(idea);
    return this.toResponseObject(idea);
  }

  async readByID(id: string): Promise<GetIdeaDTO> {
    const idea = await this._ideaRepository.findOne(id, {
      relations: ['author']
    });
    if (!idea) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return this.toResponseObject(idea);
  }

  async update(
    id: string,
    ideaObj: Partial<UpdateIdeaDto>,
    userId: string
  ): Promise<GetIdeaDTO> {
    let idea = await this._ideaRepository.findOne(id, {
      relations: ['author']
    });
    if (!idea) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    if (idea.author.id !== userId) {
      throw new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED);
    }
    idea = {
      ...idea,
      ...ideaObj
    };
    await this._ideaRepository.save(idea);
    return this.toResponseObject(idea);
  }

  async delete(id: string, userId: string) {
    const idea = await this._ideaRepository.findOne(id, {
      relations: ['author']
    });
    if (!idea) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    if (idea.author.id !== userId) {
      throw new HttpException('Not Authorized', HttpStatus.UNAUTHORIZED);
    }
    return await this._ideaRepository.delete(id);
  }

  async bookmark(id: string, userId: string): Promise<GetUserDTO> {
    const idea = await this._ideaRepository.findOne(id);
    if (!idea) {
      throw new HttpException('The idea is not exists', HttpStatus.NOT_FOUND);
    }
    const user = await this._userRepository.findOne(userId, {
      relations: ['bookmarks']
    });

    if (user.bookmarks.filter(bookmark => bookmark.id === idea.id).length) {
      throw new HttpException(
        'The idea is already bookmarked',
        HttpStatus.BAD_REQUEST
      );
    }
    user.bookmarks.push(idea);
    await this._userRepository.save(user);
    return user.toResponseObj();
  }

  async unBookmark(id: string, userId: string): Promise<GetUserDTO> {
    const idea = await this._ideaRepository.findOne(id);
    if (!idea) {
      throw new HttpException('The idea is not exists', HttpStatus.NOT_FOUND);
    }
    const user = await this._userRepository.findOne(userId, {
      relations: ['bookmarks']
    });

    if (!user.bookmarks.filter(bookmark => bookmark.id === idea.id).length) {
      throw new HttpException(
        'The idea is not bookmarked',
        HttpStatus.BAD_REQUEST
      );
    }
    user.bookmarks = user.bookmarks.filter(mark => mark.id !== idea.id);
    await this._userRepository.save(user);
    return user.toResponseObj();
  }
}
