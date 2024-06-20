import { PrismaClient } from '@prisma/client';
import { CreateProductUseCase } from '../../create-product.usecase';
import { ProductPrismaRepository } from '@/products/infrastructure/database/prisma/repositories/product-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTests } from '@/users/infrastructure/database/prisma/testing/setup-prisma-tests';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { BadRequestError } from '@/shared/domain/errors/bad-request-error';
import { ForbiddenError } from '@/shared/domain/errors/forbidden-error';

describe('CreateProductUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: CreateProductUseCase.UseCase;
  let repository: ProductPrismaRepository;
  let module: TestingModule;
  let userEntity: UserEntity;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();

    repository = new ProductPrismaRepository(prismaService as any);
  });

  beforeEach(async () => {
    sut = new CreateProductUseCase.UseCase(repository);
    await prismaService.user.deleteMany();
    await prismaService.product.deleteMany();
    userEntity = new UserEntity({ ...UserDataBuilder({}), isSeller: true });
    await prismaService.user.create({ data: userEntity.toJSON() });
  });

  afterAll(async () => {
    await prismaService.product.deleteMany();
    module.close;
  });

  it('Should create a product', async () => {
    const props = {
      ...ProductDataBuilder({}),
      user_id: userEntity.id,
    };
    const output = await sut.execute(props);
    expect(output.id).toBeDefined();
    expect(output.created_at).toBeInstanceOf(Date);
    expect(output.updated_at).toBeInstanceOf(Date);
  });

  it('Should throws error when input data not provided', async () => {
    const props = {
      name: null,
      price: null,
      stock: null,
      user_id: userEntity.id,
    };
    expect(async () => await sut.execute(props)).rejects.toThrow(
      new BadRequestError('Input data not provided'),
    );
  });

  it('Should throws error when user not isSeller', async () => {
    const newUser = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({ data: newUser.toJSON() });

    const props = {
      ...ProductDataBuilder({}),
      user_id: newUser.id,
    };
    expect(async () => await sut.execute(props)).rejects.toThrow(
      new ForbiddenError('You do not have permission to perform this action'),
    );
  });
});
