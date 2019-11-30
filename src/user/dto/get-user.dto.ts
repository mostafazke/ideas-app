import { IdeaEntity } from 'src/idea/idea.entity';

export class GetUserDTO {
  id: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
  token?: string;
  ideas?: IdeaEntity[];
}
