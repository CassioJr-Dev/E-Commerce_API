import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ValidationError } from '@/shared/domain/errors/validation-error';
import { Product } from '@prisma/client';

export class UserModelMapper {
  static toEntity(model: Product): ProductEntity {
    const {
      id,
      name,
      description,
      price,
      stock,
      user_id,
      created_at,
      updated_at,
    } = model;

    const data = {
      name,
      description,
      price: price.toNumber(),
      stock,
      user_id,
    };

    try {
      return new ProductEntity(data, id, created_at, updated_at);
    } catch {
      throw new ValidationError('An entity not be loaded');
    }
  }
}
