import { CartAndCartItemRepository } from '@/cart/domain/repositories/cart.repository';
import { UseCase as DefaultUseCase } from '../../../shared/application/usecases/use-case';

export namespace AddItemUseCase {
  export type Input = {
    cart_id: string;
    user_id: string;
  };

  export type Output = void;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private cartRepository: CartAndCartItemRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      await this.cartRepository.deleteCart(input.cart_id, input.user_id);
    }
  }
}
