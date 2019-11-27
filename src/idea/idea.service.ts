import { Injectable } from '@nestjs/common';
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
    return await this._ideaRepository.findOne(id);
  }

  async update(id: string, ideaObj: Partial<UpdateIdeaDto>) {
    let idea = await this._ideaRepository.findOne(id);
    idea = {
      ...idea,
      ...ideaObj
    };
    await this._ideaRepository.save(idea);
    return idea;
  }

  async delete(id: string) {
    const idea = { isDeleted: true };
    await this._ideaRepository.update(id, idea);
    return idea;
  }
}
