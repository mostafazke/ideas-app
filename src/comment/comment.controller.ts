import {
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Put,
  Body,
  Delete
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { User } from 'src/shared/decorators/user.decorator';
import { CreateCommentDTO, UpdateCommentDTO } from './dto';

@Controller('comment')
export class CommentController {
  constructor(private _commentService: CommentService) {}

  @Get()
  @UseGuards(new AuthGuard())
  getCommnetByUser(@User('id') userId: string) {
    return this._commentService.getCommnetByUser(userId);
  }

  @Get('idea/:id')
  getCommnetByIdea(@Param('id') ideaId: string) {
    return this._commentService.getCommnetsByIdea(ideaId);
  }

  @Get(':id')
  getCommnetById(@Param('id') id: string) {
    return this._commentService.getCommnetById(id);
  }

  @Post('idea/:id')
  @UseGuards(new AuthGuard())
  createComment(
    @Param('id') ideaId: string,
    @User('id') userId: string,
    @Body() commentObj: CreateCommentDTO
  ) {
    return this._commentService.createComment(ideaId, userId, commentObj);
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  updateComment(
    @Param('id') id: string,
    @User('id') userId: string,
    @Body() commentObj: UpdateCommentDTO
  ) {
    return this._commentService.updateComment(id, userId, commentObj);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  deleteComment(@Param('id') id: string, @User('id') userId: string) {
    return this._commentService.deleteComment(id, userId);
  }
}
