import { PrismaClient } from '@prisma/client';
import { CreateCartUseCase } from '../../createCart.usecase';
import { CartPrismaRepository } from '@/cart/infrastructure/database/prisma/repositories/cart-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTests } from '@/shared/infrastructure/database/testing/setup-prisma-tests';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { CartEntity } from '@/cart/domain/entities/cart.entity';
import { ConflictError } from '@/shared/domain/errors/conflict-error';

describe('CreateCartUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: CreateCartUseCase.UseCase;
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
    sut = new CreateCartUseCase.UseCase(repository);
    await prismaService.cart.deleteMany();
    await prismaService.cartItem.deleteMany();
    await prismaService.user.deleteMany();

    user = new UserEntity({ ...UserDataBuilder({}), isSeller: true });

    await prismaService.user.create({ data: user });
  });

  afterAll(async () => {
    await prismaService.cart.deleteMany();
    await prismaService.cartItem.deleteMany();

    module.close;
  });

  it('Should create a cart', async () => {
    const output = await sut.execute({ user_id: user.id });
    expect(output.id).toBeDefined();
    expect(output.created_at).toBeInstanceOf(Date);
    expect(output.updated_at).toBeInstanceOf(Date);
  });

  it('Should throws error when Cart already exists', async () => {
    const cart = new CartEntity({ user_id: user._id });

    await prismaService.cart.create({
      data: cart.toJSON(),
    });

    await expect(() => sut.execute({ user_id: cart.user_id })).rejects.toThrow(
      new ConflictError('Cart already exists'),
    );
  });
});
