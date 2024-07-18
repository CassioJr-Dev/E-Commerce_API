import { CartItemEntity } from '@/cart/domain/entities/cartItem.entity';

export type CartItemOutput = {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  created_at: Date;
  updated_at: Date;
};

export class CartItemOutputMapper {
  static toOutput(entity: CartItemEntity): CartItemOutput {
    return entity.toJSON();
  }
}
