import { CartAndCartItemRepository } from '@/cart/domain/repositories/cart.repository';
import { UseCase as DefaultUseCase } from '../../../shared/application/usecases/use-case';
import { CartItemEntity } from '@/cart/domain/entities/cartItem.entity';
import { CartItemOutput, CartItemOutputMapper } from '../dtos/cartItem-output';

export namespace AddItemUseCase {
  export type Input = {
    user_id: string;
    cart_id: string;
    product_id: string;
    quantity: number;
  };

  export type Output = CartItemOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private cartRepository: CartAndCartItemRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const { user_id, ...rest } = input;
      const entity = new CartItemEntity(rest);

      const addItem = await this.cartRepository.addItemToCart(entity, user_id);
      return CartItemOutputMapper.toOutput(addItem);
    }
  }
}
