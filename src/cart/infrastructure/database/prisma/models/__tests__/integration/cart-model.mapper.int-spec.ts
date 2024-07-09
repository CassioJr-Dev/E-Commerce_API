import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import { setupPrismaTests } from '@/shared/infrastructure/database/testing/setup-prisma-tests';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { CartItem, PrismaClient } from '@prisma/client';
import { CartItemModelMapper } from '../../cart-model.mapper';
import { ValidationError } from '@/shared/domain/errors/validation-error';
import { CartItemEntity } from '@/cart/domain/entities/cartItem.entity';

describe('CartItemModelMapper integration tests', () => {
  let prismaService: PrismaClient;
  let propsCart: any;
  let propsCartItem: any;
  let userProps: any;
  let productProps: any;

  beforeAll(async () => {
    setupPrismaTests();
    prismaService = new PrismaClient();
    await prismaService.$connect();
  });

  beforeEach(async () => {
    await prismaService.cartItem.deleteMany();
    await prismaService.cart.deleteMany();
    await prismaService.user.deleteMany();
    await prismaService.product.deleteMany();

    const user_id = 'f20b89e8-1740-49c5-9a5c-3a7b5639fb71';

    userProps = new UserEntity(
      {
        ...UserDataBuilder({}),
        isSeller: true,
      },
      user_id,
    );

    await prismaService.user.create({
      data: userProps,
    });

    productProps = new ProductEntity({
      ...ProductDataBuilder({}),
      user_id,
    });

    await prismaService.product.create({
      data: productProps,
    });

    propsCart = {
      id: 'd4255494-f981-4d26-a2a1-35d3f5b8d36a',
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await prismaService.cart.create({
      data: propsCart,
    });

    propsCartItem = {
      id: 'a3d0c2e2-8af9-4856-9959-408de60df9f7',
      cart_id: propsCart.id,
      product_id: productProps.id,
      quantity: 5,
      created_at: new Date(),
      updated_at: new Date(),
    };
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('Should throws error when cart model is invalid', async () => {
    const model: CartItem = Object.assign(propsCartItem, { quantity: null });

    expect(() => {
      CartItemModelMapper.toEntity(model);
    }).toThrowError(new ValidationError('An entity not be loaded'));
  });

  it('Should convert a user model to a cart entity', async () => {
    const model: CartItem = await prismaService.cartItem.create({
      data: propsCartItem,
    });
    const sut = CartItemModelMapper.toEntity(model);

    expect(sut).toBeInstanceOf(CartItemEntity);

    expect(sut.toJSON()).toStrictEqual(propsCartItem);
  });
});
