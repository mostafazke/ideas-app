import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaEntity } from 'src/idea/idea.entity';
import { Repository, DeleteResult } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { CommentEntity } from './comment.entity';
import { CreateCommentDTO, UpdateCommentDTO } from './dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentEntity)
    private _commentRepository: Repository<CommentEntity>,
    @InjectRepository(IdeaEntity)
    private _ideaRepository: Repository<IdeaEntity>,
    @InjectRepository(UserEntity)
    private _userRepository: Repository<UserEntity>
  ) {}

  async getCommnetById(id: string): Promise<CommentEntity> {
    const commnet = await this._commentRepository.findOne(id, {
      relations: ['author', 'idea']
    });
    if (!commnet) {
      throw new HttpException('Commnet not found', HttpStatus.NOT_FOUND);
    }
    // commnet.author = commnet.author.toResponseObj();
    return commnet;
  }

  async getCommnetsByIdea(ideaId: string): Promise<CommentEntity[]> {
    const idea = await this._ideaRepository.findOne(ideaId, {
      relations: ['comments']
    });
    if (!idea) {
      throw new HttpException('Idea not found', HttpStatus.NOT_FOUND);
    }
    return idea.comments;
  }

  async getCommnetByUser(userId: string): Promise<CommentEntity[]> {
    const comments = await this._commentRepository.find({
      where: { author: { id: userId } },
      relations: ['author']
    });

    return comments;
  }

  async createComment(
    ideaId: string,
    userId: string,
    commentObj: CreateCommentDTO
  ): Promise<CommentEntity> {
    const idea = await this._ideaRepository.findOne(ideaId);
    const user = await this._userRepository.findOne(userId);
    if (!idea) throw new HttpException('Idea not found', HttpStatus.NOT_FOUND);
    if (!user)
      throw new HttpException('Author not found', HttpStatus.NOT_FOUND);
    const comment = this._commentRepository.create({
      ...commentObj,
      idea,
      author: user.toResponseObj()
    });
    return await this._commentRepository.save(comment);
  }

  async updateComment(
    id: string,
    userId: string,
    commentObj: UpdateCommentDTO
  ): Promise<CommentEntity> {
    let comment = await this._commentRepository.findOne(id, {
      relations: ['author', 'idea']
    });

    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
    if (comment.author.id !== userId) {
      throw new HttpException('privileges missing', HttpStatus.FORBIDDEN);
    }

    comment = {
      ...comment,
      ...commentObj
    };
    return await this._commentRepository.save(comment);
  }

  async deleteComment(id: string, userId: string): Promise<DeleteResult> {
    let comment = await this._commentRepository.findOne(id, {
      relations: ['author', 'idea']
    });
    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }
    if (comment.author.id !== userId) {
      throw new HttpException('privileges missing', HttpStatus.FORBIDDEN);
    }

    return await this._commentRepository.delete(id);
  }
}
