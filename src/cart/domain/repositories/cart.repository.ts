import { CartEntity } from '../entities/cart.entity';
import { CartItemEntity } from '../entities/cartItem.entity';

export namespace CartAndCartItemRepository {
  export interface Repository {
    createCart(cart: CartEntity): Promise<CartEntity>;
    addItemToCart(
      item: CartItemEntity,
      user_id: string,
    ): Promise<CartItemEntity>;
    removeItemFromCart(
      item_id: string,
      cart_id: string,
      user_id: string,
    ): Promise<void>;
    updateQuantity(
      itemEntity: CartItemEntity,
      user_id: string,
    ): Promise<CartItemEntity>;
    deleteCart(cart_id: string, user_id: string): Promise<void>;
    findCart(cart_id: string, user_id: string): Promise<CartEntity>;
    cartExists(user_id: string): Promise<boolean>;
    itemExists(item_id: string, cart_id: string): Promise<CartItemEntity>;
    findAll(cart_id: string, user_id: string): Promise<CartItemEntity[]>;
  }
}
