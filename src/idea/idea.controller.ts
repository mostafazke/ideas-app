import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Logger,
  UseGuards
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { CreateIdeaDto, UpdateIdeaDto, GetIdeaDTO } from './dto';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { User } from 'src/shared/decorators/user.decorator';

@Controller('idea')
export class IdeaController {
  logger = new Logger('IdeaController');
  constructor(private _ideaService: IdeaService) {}

  @Get()
  readAllIdeas(): Promise<any[]> {
    return this._ideaService.readAll();
  }

  @Post()
  @UseGuards(AuthGuard)
  createIdea(
    @Body() ideaObj: CreateIdeaDto,
    @User('id') userId: string
  ): Promise<GetIdeaDTO> {
    this.logger.log(JSON.stringify(ideaObj));
    return this._ideaService.create(ideaObj, userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  readIdea(@Param('id') id: string): Promise<GetIdeaDTO> {
    return this._ideaService.readByID(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  updateIdea(
    @Param('id') id: string,
    @Body() ideaObj: Partial<UpdateIdeaDto>,
    @User('id') userId: string
  ): Promise<GetIdeaDTO> {
    this.logger.log(JSON.stringify(ideaObj));
    return this._ideaService.update(id, ideaObj, userId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  deleteIdea(@Param('id') id: string, @User('id') userId: string) {
    return this._ideaService.delete(id, userId);
  }
}
