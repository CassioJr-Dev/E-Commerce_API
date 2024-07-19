import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTests } from '@/shared/infrastructure/database/testing/setup-prisma-tests';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { CartPrismaRepository } from '@/cart/infrastructure/database/prisma/repositories/cart-prisma.repository';
import { CartEntity } from '@/cart/domain/entities/cart.entity';
import { DeleteCartUseCase } from '../../deleteCart.usecase';
import { DeleteItemUseCase } from '../../deleteItem.usecase';
import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import { CartItemEntity } from '@/cart/domain/entities/cartItem.entity';

describe('DeleteItemUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: DeleteItemUseCase.UseCase;
  let repository: CartPrismaRepository;
  let module: TestingModule;
  let user: UserEntity;
  let cart: CartEntity
  let product: ProductEntity

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new CartPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new DeleteItemUseCase.UseCase(repository);
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
      sut.execute({ item_id: 'fakeID', cart_id: 'fakeID', user_id: newUser.id }),
    ).rejects.toThrow(new NotFoundError('Cart not found'));
  });

  it('Should delete a item to cart', async () => {
    const newItem = new CartItemEntity({ cart_id: cart.id, product_id: product.id, quantity: 10 })
    await prismaService.cartItem.create({
      data: newItem
    })

    const output = await sut.execute({
      item_id: newItem.id, cart_id: cart.id, user_id: user.id
    });

    expect(output).toBeUndefined();
    const models = await prismaService.cartItem.findMany();
    expect(models).toHaveLength(0);
  });

  it('Should delete a item to cart not exists', async () => {

    await expect(() =>
      sut.execute({ item_id: 'fakeID', cart_id: cart.id, user_id: user.id }),
    ).rejects.toThrow(new NotFoundError('Item not found'));
  });
});
