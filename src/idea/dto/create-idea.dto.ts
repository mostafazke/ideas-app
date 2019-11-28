import { IsString, IsNotEmpty } from 'class-validator';

export class CreateIdeaDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  @IsNotEmpty()
  @IsString()
  readonly description: string;
}
