import { CartItemOutput } from '@/cart/application/dtos/cartItem-output';
import { GetItemsCartUseCase } from '@/cart/application/usecases/getItems.usecase';
import { Transform } from 'class-transformer';

export class CartItemPresenter {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  @Transform(({ value }: { value: Date }) => value.toISOString())
  created_at: Date;
  @Transform(({ value }: { value: Date }) => value.toISOString())
  updated_at: Date;

  constructor(output: CartItemOutput) {
    this.id = output.id;
    this.cart_id = output.cart_id;
    this.product_id = output.product_id;
    this.quantity = output.quantity;
    this.created_at = output.created_at;
    this.updated_at = output.updated_at;
  }
}

export class CartItemCollectionPresenter {
  data: CartItemPresenter[];

  constructor(output: GetItemsCartUseCase.Output) {
    this.data = output.map(item => new CartItemPresenter(item));
  }
}
