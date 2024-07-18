import { CartAndCartItemRepository } from '@/cart/domain/repositories/cart.repository';
import { UseCase as DefaultUseCase } from '../../../shared/application/usecases/use-case';

export namespace DeleteItemUseCase {
  export type Input = {
    item_id: string;
    cart_id: string;
    user_id: string;
  };

  export type Output = void;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private cartRepository: CartAndCartItemRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const { item_id, cart_id, user_id } = input;
      await this.cartRepository.removeItemFromCart(item_id, cart_id, user_id);
    }
  }
}
