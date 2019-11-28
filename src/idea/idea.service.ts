import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IdeaEntity } from './idea.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateIdeaDto, UpdateIdeaDto } from './dto';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(IdeaEntity)
    private _ideaRepository: Repository<IdeaEntity>
  ) {}

  async readAll() {
    return await this._ideaRepository.find();
  }

  async create(ideaObj: CreateIdeaDto) {
    const idea = this._ideaRepository.create(ideaObj);
    await this._ideaRepository.save(idea);
    return idea;
  }

  async readByID(id: string) {
    const idea = await this._ideaRepository.findOne(id);
    if (!idea) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return idea;
  }

  async update(id: string, ideaObj: Partial<UpdateIdeaDto>) {
    let idea = await this._ideaRepository.findOne(id);
    if (!idea) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    idea = {
      ...idea,
      ...ideaObj
    };
    await this._ideaRepository.save(idea);
    return idea;
  }

  async delete(id: string) {
    const idea = await this._ideaRepository.findOne(id);
    if (!idea) throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    return await this._ideaRepository.delete(id);
  }
}
