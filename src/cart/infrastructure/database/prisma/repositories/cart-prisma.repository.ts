import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { CartAndCartItemRepository } from '@/cart/domain/repositories/cart.repository';
import { CartItemEntity } from '@/cart/domain/entities/cartItem.entity';
import { CartEntity } from '@/cart/domain/entities/cart.entity';
import {
  CartItemModelMapper,
  CartModelMapper,
} from '../models/cart-model.mapper';
import { ConflictError } from '@/shared/domain/errors/conflict-error';

export class CartPrismaRepository
  implements CartAndCartItemRepository.Repository
{
  constructor(private prismaService: PrismaService) {}

  async addItemToCart(
    item: CartItemEntity,
    user_id: string,
  ): Promise<CartItemEntity> {
    const cartExists = await this.cartExists(item.cart_id, user_id);

    if (!cartExists) {
      throw new NotFoundError('Cart not found');
    }

    const addItem = await this.prismaService.cartItem.create({
      data: item.toJSON(),
    });

    return CartItemModelMapper.toEntity(addItem);
  }

  async removeItemFromCart(
    item_id: string,
    cart_id: string,
    user_id: string,
  ): Promise<void> {
    const cartExists = await this.cartExists(cart_id, user_id);

    if (!cartExists) {
      throw new NotFoundError('Cart not found');
    }

    await this.itemExists(item_id, cart_id);

    await this.prismaService.cartItem.delete({
      where: { id: item_id, cart_id },
    });
  }

  async updateQuantity(
    cart_id: string,
    item_id: string,
    quantity: number,
    user_id: string,
  ): Promise<CartItemEntity> {
    const cartExists = await this.cartExists(cart_id, user_id);

    if (!cartExists) {
      throw new NotFoundError('Cart not found');
    }
    const item = await this.itemExists(item_id, cart_id);

    const updateItem = await this.prismaService.cartItem.update({
      where: { id: item.id, cart_id: item.cart_id },
      data: {
        ...item.toJSON(),
        quantity,
      },
    });

    return CartItemModelMapper.toEntity(updateItem);
  }

  async deleteCart(cart_id: string, user_id: string): Promise<void> {
    const cartExists = await this.cartExists(cart_id, user_id);

    if (!cartExists) {
      throw new NotFoundError('Cart not found');
    }
    await this.prismaService.cart.delete({
      where: { id: cart_id, user_id },
    });
  }

  async findAll(cart_id: string, user_id: string): Promise<CartItemEntity[]> {
    const cartExists = await this.cartExists(cart_id, user_id);

    if (!cartExists) {
      throw new NotFoundError('Cart not found');
    }
    const cartItems = await this.prismaService.cartItem.findMany({
      where: {
        cart_id,
      },
    });

    return cartItems.map(item => CartItemModelMapper.toEntity(item));
  }

  async cartExists(cart_id: string, user_id: string): Promise<boolean> {
    const findCart = await this.prismaService.cart.findUnique({
      where: { id: cart_id, user_id: user_id },
    });

    if (findCart) {
      return true;
    }

    return false;
  }

  async itemExists(item_id: string, cart_id: string): Promise<CartItemEntity> {
    const findItem = await this.prismaService.cartItem.findUnique({
      where: { id: item_id, cart_id: cart_id },
    });

    if (!findItem) {
      throw new NotFoundError('Item not found');
    }

    return CartItemModelMapper.toEntity(findItem);
  }

  async createCart(cart: CartEntity): Promise<CartEntity> {
    const cartExists = await this.cartExists(cart.id, cart.user_id);
    if (cartExists) {
      throw new ConflictError('Cart already exists');
    }

    const createCart = await this.prismaService.cart.create({
      data: cart.toJSON(),
    });

    return CartModelMapper.toEntity(createCart);
  }

  async findCart(cart_id: string, user_id: string): Promise<CartEntity> {
    const findCart = await this.prismaService.cart.findUnique({
      where: { id: cart_id, user_id: user_id },
    });

    if (!findCart) {
      throw new NotFoundError('Cart not found');
    }

    return CartModelMapper.toEntity(findCart);
  }
}
