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

describe('DeleteCartUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: DeleteCartUseCase.UseCase;
  let repository: CartPrismaRepository;
  let module: TestingModule;
  let user: UserEntity;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new CartPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new DeleteCartUseCase.UseCase(repository);
    await prismaService.cart.deleteMany();
    await prismaService.cartItem.deleteMany();
    await prismaService.user.deleteMany();

    user = new UserEntity({ ...UserDataBuilder({}), isSeller: true });

    await prismaService.user.create({ data: user });
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
      sut.execute({ cart_id: 'fakeId', user_id: user.id }),
    ).rejects.toThrow(new NotFoundError('Cart not found'));
  });

  it('Should delete a cart', async () => {
    const cartEntity = new CartEntity({ user_id: user.id });
    await prismaService.cart.create({
      data: cartEntity,
    });

    const output = await sut.execute({
      cart_id: cartEntity.id,
      user_id: user.id,
    });
    expect(output).toBeUndefined();
    const models = await prismaService.cart.findMany();
    expect(models).toHaveLength(0);
  });
});
('');
