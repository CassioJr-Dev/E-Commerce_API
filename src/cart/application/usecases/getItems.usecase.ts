import { CartAndCartItemRepository } from '@/cart/domain/repositories/cart.repository';
import { UseCase as DefaultUseCase } from '../../../shared/application/usecases/use-case';
import { CartItemOutput } from '../dtos/cartItem-output';
import { CartItemModelMapper } from '@/cart/infrastructure/database/prisma/models/cart-model.mapper';

export namespace getItemsCartUseCase {
  export type Input = {
    cart_id: string;
    user_id: string;
  };

  export type Output = CartItemOutput[];

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private cartRepository: CartAndCartItemRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const { cart_id, user_id } = input;

      const findItems = await this.cartRepository.findAll(cart_id, user_id);

      return findItems.map(item => CartItemModelMapper.toEntity(item));
    }
  }
}
