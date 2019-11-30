import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IdeaEntity } from './idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateIdeaDto, UpdateIdeaDto, GetIdeaDTO } from './dto';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private _ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private _userRepository: Repository<UserEntity>
  ) {}

  private toResponseObject(idea: IdeaEntity) {
    return { ...idea, author: idea.author.toResponseObj() };
  }

  async readAll(): Promise<GetIdeaDTO[]> {
    const ideas = await this._ideaRepository.find({ relations: ['author'] });
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
}
