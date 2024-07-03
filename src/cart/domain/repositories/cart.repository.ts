import { CartItemEntity } from '../entities/cartItem.entity';
import { CartEntity } from '../entities/cart.entity';
import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface,
} from '@/shared/domain/repositories/searchable-repository-contracts';

// Definindo os namespaces CartRepository e CartItemRepository
export namespace CartRepository {
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> {}

  export class SearchResult extends DefaultSearchResult<CartEntity, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      CartEntity,
      Filter,
      SearchParams,
      SearchResult
    > {
    cartExists(cart_id: string, user_id: string): Promise<void>;
  }
}

export namespace CartItemRepository {
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> {}

  export class SearchResult extends DefaultSearchResult<CartItemEntity, Filter> {}

  export interface Repository
    extends SearchableRepositoryInterface<
      CartItemEntity,
      Filter,
      SearchParams,
      SearchResult
    > {
    itemExists(item_id: string, cart_id: string): Promise<void>;
  }
}

// Definindo o repositório combinado CartAndCartItemRepository
export namespace CartAndCartItemRepository {
  export type CartFilter = string;
  export type CartItemFilter = string;

  export class CartSearchParams extends DefaultSearchParams<CartFilter> {}
  export class CartItemSearchParams extends DefaultSearchParams<CartItemFilter> {}

  export class CartSearchResult extends DefaultSearchResult<CartEntity, CartFilter> {}
  export class CartItemSearchResult extends DefaultSearchResult<CartItemEntity, CartItemFilter> {}

  export interface Repository {
    cartRepository: CartRepository.Repository;
    cartItemRepository: CartItemRepository.Repository;

    // Métodos adicionais para operações combinadas
    addItemToCart(cart_id: string, item: CartItemEntity): Promise<void>;
    removeItemFromCart(cart_id: string, item_id: string): Promise<void>;
    updateQuantity(cart_id: string, item_id: string, quantity: number): Promise<CartItemEntity>;
    deleteCart(cart_id: string): Promise<void>;
  }
}
