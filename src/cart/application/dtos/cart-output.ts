import { CartEntity } from '@/cart/domain/entities/cart.entity';

export type CartOutput = {
  id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
};

export class CartOutputMapper {
  static toOutput(entity: CartEntity): CartOutput {
    return entity.toJSON();
  }
}
