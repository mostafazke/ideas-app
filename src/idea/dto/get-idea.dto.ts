import { GetUserDTO } from 'src/user/dto';

export class GetIdeaDTO {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  author: GetUserDTO;
}
