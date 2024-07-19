import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTests } from '@/shared/infrastructure/database/testing/setup-prisma-tests';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { CartPrismaRepository } from '@/cart/infrastructure/database/prisma/repositories/cart-prisma.repository';
import { CartEntity } from '@/cart/domain/entities/cart.entity';
import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import { CartItemEntity } from '@/cart/domain/entities/cartItem.entity';
import { GetItemsCartUseCase } from '../../getItems.usecase';

describe('GetItemsCartUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: GetItemsCartUseCase.UseCase;
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
    sut = new GetItemsCartUseCase.UseCase(repository);
    await prismaService.cart.deleteMany();
    await prismaService.cartItem.deleteMany();
    await prismaService.user.deleteMany();

    user = new UserEntity({ ...UserDataBuilder({}), isSeller: true });
    await prismaService.user.create({ data: user });

    cart = new CartEntity({ user_id: user.id });
    await prismaService.cart.create({
      data: cart,
    });

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

  it('Should throws error when Cart not exists', async () => {
    const newUser = new UserEntity({ ...UserDataBuilder({}), isSeller: true });
    await prismaService.user.create({ data: newUser });

    await expect(() =>
      sut.execute({
        cart_id: 'fakeID',
        user_id: newUser.id,
      }),
    ).rejects.toThrow(new NotFoundError('Cart not found'));
  });

  it('Should get items to cart', async () => {
    const newItem = new CartItemEntity({
      cart_id: cart.id,
      product_id: product.id,
      quantity: 10,
    });
    const createItem = await prismaService.cartItem.create({
      data: newItem,
    });

    const output = await sut.execute({
      cart_id: cart.id,
      user_id: user.id,
    });
    console.log(output[0]);
    console.log(createItem);

    expect(output).toStrictEqual([createItem]);
  });
});
