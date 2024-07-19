import { CartAndCartItemRepository } from '@/cart/domain/repositories/cart.repository';
import { UseCase as DefaultUseCase } from '../../../shared/application/usecases/use-case';
import { CartItemOutput, CartItemOutputMapper } from '../dtos/cartItem-output';

export namespace GetItemsCartUseCase {
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

      return findItems.map(item => CartItemOutputMapper.toOutput(item));
    }
  }
}
