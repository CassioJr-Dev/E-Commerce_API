import { ValidationError } from '@/shared/domain/errors/validation-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { User } from '@prisma/client';

export class UserModelMapper {
  static toEntity(model: User): UserEntity {
    const { id, name, isSeller, email, password, created_at, updated_at } =
      model;

    const data = {
      name,
      isSeller,
      email,
      password,
    };

    try {
      return new UserEntity(data, id, created_at, updated_at);
    } catch {
      throw new ValidationError('An entity not be loaded');
    }
  }
}
