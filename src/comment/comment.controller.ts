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
import { CreateCommentDTO } from './dto';

@Controller('comment')
export class CommentController {
  constructor(private _commentService: CommentService) {}

  @Get('idea/:id')
  getCommnetByIdea(@Param('id') ideaId: string) {}

  @Get('user/:id')
  getCommnetByUser(@Param('id') userId: string) {}

  @Get(':id')
  getCommnetById(@Param('id') id: string) {}

  @Post('idea/:id')
  @UseGuards(new AuthGuard())
  createComment(
    @Param('id') ideaId: string,
    @User('id') userId: string,
    @Body() commentObj: CreateCommentDTO
  ) {}

  @Put('idea/:id')
  @UseGuards(new AuthGuard())
  updateComment(
    @Param('id') ideaId: string,
    @User('id') userId: string,
    @Body() commentObj: CreateCommentDTO
  ) {}

  @Delete(':id')
  @UseGuards(new AuthGuard())
  deleteComment(@Param('id') id: string, @User('id') userId: string) {}
}
