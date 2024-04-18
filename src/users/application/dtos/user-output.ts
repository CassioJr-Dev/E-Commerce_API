import { UserEntity } from '@/users/domain/entities/user.entity';

export type UserOutput = {
  id: string;
  name: string;
  isSeller: boolean;
  password: string;
  created_at: Date;
  update_at: Date;
};

export class UserOutputMapper {
  static toOutput(entity: UserEntity): UserOutput {
    return entity.toJSON();
  }
}
