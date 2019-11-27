import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { CreateIdeaDto, UpdateIdeaDto } from './dto';
import { IdeaEntity } from './idea.entity';

@Controller('idea')
export class IdeaController {
  constructor(private _ideaService: IdeaService) {}

  @Get()
  readAllIdeas(): Promise<IdeaEntity[]> {
    return this._ideaService.readAll();
  }

  @Post()
  createIdea(@Body() ideaObj: CreateIdeaDto): Promise<IdeaEntity> {
    return this._ideaService.create(ideaObj);
  }

  @Get(':id')
  readIdea(@Param('id') id: string): Promise<IdeaEntity> {
    return this._ideaService.readByID(id);
  }

  @Put(':id')
  updateIdea(
    @Param('id') id: string,
    @Body() ideaObj: Partial<UpdateIdeaDto>
  ): Promise<IdeaEntity> {
    return this._ideaService.update(id, ideaObj);
  }

  @Delete(':id')
  deleteIdea(@Param('id') id: string) {
    return this._ideaService.delete(id);
  }
}
