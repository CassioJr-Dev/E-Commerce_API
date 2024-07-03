import { PrismaClient } from '@prisma/client';
import { UpdateProductUseCase } from '../../update-product.usecase';
import { ProductPrismaRepository } from '@/products/infrastructure/database/prisma/repositories/product-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTests } from '@/shared/infrastructure/database/testing/setup-prisma-tests';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { ForbiddenError } from '@/shared/domain/errors/forbidden-error';
import { BadRequestError } from '@/shared/domain/errors/bad-request-error';

describe('UpdateProductUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: UpdateProductUseCase.UseCase;
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
    sut = new UpdateProductUseCase.UseCase(repository);
    await prismaService.user.deleteMany();
    await prismaService.product.deleteMany();
    userEntity = new UserEntity({ ...UserDataBuilder({}), isSeller: true });
    await prismaService.user.create({ data: userEntity.toJSON() });
  });

  afterAll(async () => {
    await prismaService.user.deleteMany();
    await prismaService.product.deleteMany();
    module.close();
  });

  it('Should throws error when entity not found', async () => {
    const product = new ProductEntity({
      ...ProductDataBuilder({}),
      user_id: userEntity.id,
    });
    await prismaService.product.create({
      data: product.toJSON(),
    });
    await expect(() =>
      sut.execute({ id: 'fakeId', name: 'fake name', user_id: userEntity.id }),
    ).rejects.toThrow(new NotFoundError('ProductModel not found'));
  });

  it('Should throws error when propertys all null', async () => {
    const product = new ProductEntity({
      ...ProductDataBuilder({}),
      user_id: userEntity.id,
    });
    await prismaService.product.create({
      data: product.toJSON(),
    });
    await expect(() =>
      sut.execute({ id: product.id, user_id: userEntity.id }),
    ).rejects.toThrow(new BadRequestError('No valid properties provided'));
  });

  it('Should throws error when user not isSeller', async () => {
    const props = {
      ...ProductDataBuilder({}),
      user_id: userEntity.id,
    };

    const productEntity = new ProductEntity(props);
    await prismaService.product.create({
      data: productEntity.toJSON(),
    });

    userEntity.updateIsSeller(false);

    await prismaService.user.update({
      data: userEntity,
      where: {
        id: userEntity.id,
      },
    });

    await expect(
      async () =>
        await sut.execute({
          id: productEntity.id,
          name: 'new name',
          user_id: userEntity.id,
        }),
    ).rejects.toThrow(
      new ForbiddenError('You do not have permission to perform this action'),
    );
  });

  it('Should update a product', async () => {
    const entity = new ProductEntity({
      ...ProductDataBuilder({}),
      user_id: userEntity.id,
    });
    await prismaService.product.create({
      data: entity.toJSON(),
    });

    const output = await sut.execute({
      id: entity._id,
      name: 'new name',
      user_id: userEntity.id,
    });

    expect(output.name).toBe('new name');
  });
});
