import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  BeforeInsert,
  OneToMany
} from 'typeorm';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { GetUserDTO } from './dto';
import { IdeaEntity } from 'src/idea/idea.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'text',
    unique: true
  })
  username: string;

  @Column('text')
  password: string;

  @OneToMany(
    type => IdeaEntity,
    idea => idea.author
  )
  ideas: IdeaEntity[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }

  toResponseObj(withToken = false): GetUserDTO {
    const { id, username, createdAt, updatedAt, token } = this;
    const response: GetUserDTO = { id, username, createdAt, updatedAt };

    if (withToken) {
      response.token = token;
    }

    if (this.ideas) {
      response.ideas = this.ideas;
    }

    return response;
  }

  async comparePassword(password: string) {
    return await compare(password, this.password);
  }

  private get token(): string {
    const { id, username, createdAt, updatedAt } = this;
    return sign({ id, username, createdAt, updatedAt }, process.env.SECRET, {
      expiresIn: '7d'
    });
  }
}
