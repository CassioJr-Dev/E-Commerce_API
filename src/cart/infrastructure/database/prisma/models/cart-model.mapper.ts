import { CartEntity } from '@/cart/domain/entities/cart.entity';
import { CartItemEntity } from '@/cart/domain/entities/cartItem.entity';
import { ValidationError } from '@/shared/domain/errors/validation-error';
import { Cart, CartItem } from '@prisma/client';

export class CartModelMapper {
  static toEntity(model: Cart): CartEntity {
    const { id, user_id, created_at, updated_at } = model;

    const data = {
      user_id,
    };

    try {
      return new CartEntity(data, id, created_at, updated_at);
    } catch {
      throw new ValidationError('An entity not be loaded');
    }
  }
}

export class CartItemModelMapper {
  static toEntity(model: CartItem): CartItemEntity {
    const { id, cart_id, product_id, quantity, created_at, updated_at } = model;

    const data = {
      cart_id,
      product_id,
      quantity,
    };

    try {
      return new CartItemEntity(data, id, created_at, updated_at);
    } catch {
      throw new ValidationError('An entity not be loaded');
    }
  }
}
