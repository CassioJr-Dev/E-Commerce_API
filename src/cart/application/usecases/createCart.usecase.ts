import { CartAndCartItemRepository } from '@/cart/domain/repositories/cart.repository';
import { UseCase as DefaultUseCase } from '../../../shared/application/usecases/use-case';
import { CartEntity } from '@/cart/domain/entities/cart.entity';
import { CartOutput, CartOutputMapper } from '../dtos/cart-output';

export namespace AddItemUseCase {
  export type Input = {
    user_id: string;
  };

  export type Output = CartOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private cartRepository: CartAndCartItemRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const cartEntity = new CartEntity(input);
      return CartOutputMapper.toOutput(
        await this.cartRepository.createCart(cartEntity),
      );
    }
  }
}
