import { PrismaClient, Product } from '@prisma/client';
import { CartPrismaRepository } from '@/cart/infrastructure/database/prisma/repositories/cart-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTests } from '@/shared/infrastructure/database/testing/setup-prisma-tests';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { CartEntity } from '@/cart/domain/entities/cart.entity';
import { AddItemUseCase } from '../../addItem.usecase';
import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import { ConflictError } from '@/shared/domain/errors/conflict-error';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { CartItemEntity } from '@/cart/domain/entities/cartItem.entity';

describe('AddItemUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: AddItemUseCase.UseCase;
  let repository: CartPrismaRepository;
  let module: TestingModule;
  let user: UserEntity;
  let cart: CartEntity;
  let product: ProductEntity;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new CartPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new AddItemUseCase.UseCase(repository);
    await prismaService.cart.deleteMany();
    await prismaService.cartItem.deleteMany();
    await prismaService.user.deleteMany();

    user = new UserEntity({ ...UserDataBuilder({}), isSeller: true });
    await prismaService.user.create({ data: user });

    cart = new CartEntity({ user_id: user.id });
    await prismaService.cart.create({ data: cart });

    product = new ProductEntity({
      ...ProductDataBuilder({}),
      user_id: user.id,
    });
    await prismaService.product.create({ data: product });
  });

  afterAll(async () => {
    await prismaService.cart.deleteMany();
    await prismaService.cartItem.deleteMany();
    await prismaService.user.deleteMany();

    module.close;
  });

  it('Should insert a item to cart', async () => {
    const props = {
      user_id: user.id,
      cart_id: cart.id,
      product_id: product.id,
      quantity: 5,
    };
    const output = await sut.execute(props);

    const findItem = await prismaService.cartItem.findUnique({
      where: { id: output.id, cart_id: cart.id },
    });
    expect(output).toStrictEqual(findItem);
  });

  it('Should throws error when Cart not exists', async () => {
    const newUser = new UserEntity({ ...UserDataBuilder({}), isSeller: true });
    await prismaService.user.create({ data: newUser });

    const props = {
      user_id: newUser.id,
      cart_id: 'fakeId',
      product_id: product.id,
      quantity: 5,
    };

    await expect(() => sut.execute(props)).rejects.toThrow(
      new NotFoundError('Cart not found'),
    );
  });

  it('Should throws error when Cart already exists', async () => {
    const props = {
      cart_id: cart.id,
      product_id: product.id,
      quantity: 5,
    };

    const newItem = new CartItemEntity(props);

    await prismaService.cartItem.create({
      data: newItem,
    });

    await expect(() =>
      sut.execute({ ...props, user_id: user.id }),
    ).rejects.toThrow(
      new ConflictError('The product already exists in the cart'),
    );
  });
});
