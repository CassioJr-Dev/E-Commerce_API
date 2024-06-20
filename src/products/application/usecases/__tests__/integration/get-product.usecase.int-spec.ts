import { PrismaClient } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTests } from '@/users/infrastructure/database/prisma/testing/setup-prisma-tests';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { GetProductUseCase } from '../../get-product.usecase';
import { ProductPrismaRepository } from '@/products/infrastructure/database/prisma/repositories/product-prisma.repository';
import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import { ProductModelMapper } from '@/products/infrastructure/database/prisma/models/product-model.mapper';

describe('GetProductUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: GetProductUseCase.UseCase;
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
    sut = new GetProductUseCase.UseCase(repository);
    await prismaService.user.deleteMany();
    await prismaService.product.deleteMany();
    userEntity = new UserEntity({ ...UserDataBuilder({}), isSeller: true });
    await prismaService.user.create({ data: userEntity.toJSON() });
  });

  afterAll(async () => {
    await prismaService.user.deleteMany();
    await prismaService.product.deleteMany();
    module.close;
  });

  it('Should throws error when entity not found', async () => {
    await expect(() => sut.execute({ id: 'fakeId' })).rejects.toThrow(
      new NotFoundError('ProductModel not found'),
    );
  });

  it('Should returns a product', async () => {
    const entity = new ProductEntity({
      ...ProductDataBuilder({}),
      user_id: userEntity.id,
    });

    const model = ProductModelMapper.toEntity(
      await prismaService.product.create({
        data: entity.toJSON(),
      }),
    ).toJSON();
    const output = await sut.execute({ id: entity.id });

    expect(output).toMatchObject(model);
  });
});
