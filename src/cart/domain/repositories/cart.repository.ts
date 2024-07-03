import { CartItemEntity } from '../entities/cartItem.entity';
import { CartEntity } from '../entities/cart.entity';

export namespace CartAndCartItemRepository {
  export interface Repository {
    addItemToCart(cart: CartEntity, item: CartItemEntity): Promise<void>;
    removeItemFromCart(item_id: string, cart_id: string): Promise<void>;
    updateQuantity(
      cart_id: string,
      item_id: string,
      quantity: number,
    ): Promise<CartItemEntity>;
    deleteCart(cart_id: string, user_id: string): Promise<void>;
    cartExists(cart_id: string, user_id: string): Promise<boolean>;
    itemExists(item_id: string, cart_id: string): Promise<CartItemEntity>;
    findAll(cart_id: string, user_id: string): Promise<CartItemEntity[]>;
  }
}
