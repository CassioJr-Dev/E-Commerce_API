import { CartAndCartItemRepository } from '@/cart/domain/repositories/cart.repository';
import { UseCase as DefaultUseCase } from '../../../shared/application/usecases/use-case';
import { CartOutput, CartOutputMapper } from '../dtos/cart-output';

export namespace getCartUseCase {
  export type Input = {
    cart_id: string;
    user_id: string;
  };

  export type Output = CartOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private cartRepository: CartAndCartItemRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const { cart_id, user_id } = input;

      const findCart = await this.cartRepository.findCart(cart_id, user_id);

      return CartOutputMapper.toOutput(findCart);
    }
  }
}
