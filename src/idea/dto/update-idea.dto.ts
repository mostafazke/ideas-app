import { IsString } from 'class-validator';

export class UpdateIdeaDto {
  @IsString()
  readonly name: string;
  @IsString()
  readonly description: string;
}
