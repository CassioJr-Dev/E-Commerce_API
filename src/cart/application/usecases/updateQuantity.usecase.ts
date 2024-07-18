import { CartAndCartItemRepository } from '@/cart/domain/repositories/cart.repository';
import { UseCase as DefaultUseCase } from '../../../shared/application/usecases/use-case';
import { CartItemOutput } from '../dtos/cartItem-output';
import { CartItemModelMapper } from '@/cart/infrastructure/database/prisma/models/cart-model.mapper';

export namespace updateQuantityUseCase {
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
      const { cart_id, item_id, quantity, user_id } = input;

      const update = await this.cartRepository.updateQuantity(
        cart_id,
        item_id,
        quantity,
        user_id,
      );

      return CartItemModelMapper.toEntity(update);
    }
  }
}
