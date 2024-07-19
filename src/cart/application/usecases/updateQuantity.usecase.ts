import { CartAndCartItemRepository } from '@/cart/domain/repositories/cart.repository';
import { UseCase as DefaultUseCase } from '../../../shared/application/usecases/use-case';
import { CartItemOutput, CartItemOutputMapper } from '../dtos/cartItem-output';
import { CartItemModelMapper } from '@/cart/infrastructure/database/prisma/models/cart-model.mapper';
import { CartItemEntity } from '@/cart/domain/entities/cartItem.entity';

export namespace UpdateQuantityUseCase {
  export type Input = {
    cart_id: string;
    item_id: string;
    quantity: number;
    user_id: string;
  };

  export type Output = CartItemOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private cartRepository: CartAndCartItemRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const { id, cart_id, product_id, quantity, created_at, updated_at } =
        await this.cartRepository.itemExists(input.item_id, input.cart_id);

      const updateItem = new CartItemEntity(
        {
          cart_id: cart_id,
          product_id: product_id,
          quantity: quantity,
        },
        id,
        created_at,
        updated_at,
      );

      updateItem.updateQuantity(input.quantity);

      const update = await this.cartRepository.updateQuantity(
        updateItem,
        input.user_id,
      );

      return CartItemOutputMapper.toOutput(update);
    }
  }
}
