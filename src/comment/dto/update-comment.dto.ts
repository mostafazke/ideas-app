import { IsString } from 'class-validator';

export class UpdateCommentDTO {
  @IsString()
  comment: string;
}
