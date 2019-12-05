import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  BeforeInsert,
  OneToMany,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { GetUserDTO } from './dto';
import { IdeaEntity } from 'src/idea/idea.entity';
import { Exclude } from 'class-transformer';

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
  @Exclude()
  password: string;

  @OneToMany(
    type => IdeaEntity,
    idea => idea.author
  )
  ideas: IdeaEntity[];

  @ManyToMany(type => IdeaEntity, { cascade: true })
  @JoinTable()
  bookmarks: IdeaEntity[];

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

    if (this.bookmarks) {
      response.bookmarks = this.bookmarks;
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
