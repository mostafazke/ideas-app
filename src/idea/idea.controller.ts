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
import { Helper } from 'src/shared/helper';
@Controller('idea')
export class IdeaController {
  helper = Helper.getInstance();
  constructor(private _ideaService: IdeaService) {}

  @Get()
  readAllIdeas(): Promise<any[]> {
    return this._ideaService.readAll();
  }

  @Post()
  @UseGuards(new AuthGuard())
  createIdea(
    @Body() ideaObj: CreateIdeaDto,
    @User('id') userId: string
  ): Promise<GetIdeaDTO> {
    this.helper.logData(ideaObj, userId);
    return this._ideaService.create(ideaObj, userId);
  }

  @Get(':id')
  readIdea(@Param('id') id: string): Promise<GetIdeaDTO> {
    this.helper.logData(id);
    return this._ideaService.readByID(id);
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  updateIdea(
    @Param('id') id: string,
    @Body() ideaObj: Partial<UpdateIdeaDto>,
    @User('id') userId: string
  ): Promise<GetIdeaDTO> {
    this.helper.logData(id, ideaObj, userId);
    return this._ideaService.update(id, ideaObj, userId);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  deleteIdea(@Param('id') id: string, @User('id') userId: string) {
    this.helper.logData(id, userId);
    return this._ideaService.delete(id, userId);
  }

  @Post(':id/bookmark')
  @UseGuards(new AuthGuard())
  bookmarkIdea(@Param('id') id: string, @User('id') userId: string) {
    this.helper.logData(id, userId);
    return this._ideaService.bookmark(id, userId);
  }

  @Delete(':id/bookmark')
  @UseGuards(new AuthGuard())
  unBookmarkIdea(@Param('id') id: string, @User('id') userId: string) {
    this.helper.logData(id, userId);
    return this._ideaService.unBookmark(id, userId);
  }

  @Post(':id/upvote')
  @UseGuards(new AuthGuard())
  upvote(@Param('id') id: string, @User('id') userId: string) {
    this.helper.logData(id, userId);
    return this._ideaService.upvote(id, userId);
  }

  @Post(':id/downvote')
  @UseGuards(new AuthGuard())
  downvote(@Param('id') id: string, @User('id') userId: string) {
    this.helper.logData(id, userId);
    return this._ideaService.downvote(id, userId);
  }
}
