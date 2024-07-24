import { Cart, PrismaClient } from '@prisma/client';
import { CartPrismaRepository } from '../../cart-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTests } from '@/shared/infrastructure/database/testing/setup-prisma-tests';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import { CartEntity } from '@/cart/domain/entities/cart.entity';
import { CartItemEntity } from '@/cart/domain/entities/cartItem.entity';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { ConflictError } from '@/shared/domain/errors/conflict-error';

describe('CartPrismaRepository integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: CartPrismaRepository;
  let module: TestingModule;
  let userProps: UserEntity;
  let productProps: ProductEntity;
  let cart: CartEntity;
  let cartItem: CartItemEntity;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
  });

  beforeEach(async () => {
    await prismaService.cartItem.deleteMany();
    await prismaService.cart.deleteMany();
    await prismaService.user.deleteMany();
    await prismaService.product.deleteMany();

    sut = new CartPrismaRepository(prismaService as any);

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

    cart = new CartEntity({ user_id: userProps.id });
    cartItem = new CartItemEntity({
      cart_id: cart.id,
      product_id: productProps.id,
      quantity: 10,
    });
  });

  afterAll(async () => {
    await prismaService.user.deleteMany();
  });

  it('Should throws error when Cart already exists', async () => {
    await sut.createCart(cart);
    await expect(() => sut.createCart(cart)).rejects.toThrow(
      new ConflictError('Cart already exists'),
    );
  });

  it('Should create a cart', async () => {
    await sut.createCart(cart);

    const result = await prismaService.cart.findUnique({
      where: {
        id: cart._id,
      },
    });
    expect(result).toStrictEqual(cart.toJSON());
  });

  it('Should throws error when Cart not found', async () => {
    await expect(() => sut.findAll(cart._id, userProps.id)).rejects.toThrow(
      new NotFoundError('Cart not found'),
    );
  });

  it('Should insert a item to cart', async () => {
    await sut.createCart(cart);
    await sut.addItemToCart(cartItem, cart.user_id);

    const result = await prismaService.cartItem.findUnique({
      where: {
        id: cartItem._id,
      },
    });
    expect(result).toStrictEqual(cartItem.toJSON());
  });

  it('Should throws error when product not found', async () => {
    const newItem = new CartItemEntity({
      cart_id: cartItem.id,
      product_id: 'FakeId',
      quantity: 5,
    });

    await expect(() =>
      sut.addItemToCart(newItem, userProps.id),
    ).rejects.toThrow(new NotFoundError('Product not found'));
  });

  it('Should returns all cartItems', async () => {
    await sut.createCart(cart);
    await sut.addItemToCart(cartItem, cart.user_id);
    const entities = await sut.findAll(cart.id, userProps._id);

    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([cartItem]));
    entities.map(item =>
      expect(item.toJSON()).toStrictEqual(cartItem.toJSON()),
    );
  });

  it('Should throws error on update when a entity not found', async () => {
    await sut.createCart(cart);
    await expect(() =>
      sut.updateQuantity(cartItem, cart.user_id),
    ).rejects.toThrow(new NotFoundError('Item not found'));
  });

  it('Should update a entity', async () => {
    await sut.createCart(cart);
    await sut.addItemToCart(cartItem, cart.user_id);

    cartItem.updateQuantity(20);
    await sut.updateQuantity(cartItem, cart.user_id);

    const output = await prismaService.cartItem.findUnique({
      where: {
        id: cartItem._id,
      },
    });

    expect(output.quantity).toBe(20);
  });

  it('Should throws error on delete when cart not found', async () => {
    await expect(() => sut.deleteCart('fakeId', userProps.id)).rejects.toThrow(
      new NotFoundError('Cart not found'),
    );
  });

  it('Should delete a cart', async () => {
    await sut.createCart(cart);
    await sut.addItemToCart(cartItem, cart.user_id);
    await sut.deleteCart(cart.id, userProps.id);

    const output = await prismaService.cart.findUnique({
      where: {
        id: cart.id,
      },
    });

    expect(output).toBeNull();
  });
  it('Should throws error on delete when item not found', async () => {
    await sut.createCart(cart);
    await expect(() =>
      sut.removeItemFromCart('fakeId', cart.id, userProps.id),
    ).rejects.toThrow(new NotFoundError('Item not found'));
  });

  it('Should delete a item', async () => {
    await sut.createCart(cart);
    await sut.addItemToCart(cartItem, cart.user_id);
    await sut.removeItemFromCart(cartItem.id, cart.id, userProps.id);

    const output = await prismaService.cartItem.findUnique({
      where: {
        id: cart.id,
      },
    });

    expect(output).toBeNull();
  });

  it('Should throws error on find when cart not found', async () => {
    await expect(() => sut.findCart('fakeId', userProps.id)).rejects.toThrow(
      new NotFoundError('Cart not found'),
    );
  });

  it('Should find a cart', async () => {
    await sut.createCart(cart);
    await sut.findCart(cart.id, cart.user_id);

    const output = await prismaService.cart.findUnique({
      where: {
        id: cart.id,
      },
    });

    expect(output).toMatchObject({ user_id: cart.user_id });
  });
});
