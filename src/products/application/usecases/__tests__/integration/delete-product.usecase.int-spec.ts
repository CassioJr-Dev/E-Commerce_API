import { PrismaClient } from '@prisma/client';
import { DeleteProductUseCase } from '../../delete-product.usecase';
import { ProductPrismaRepository } from '@/products/infrastructure/database/prisma/repositories/product-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTests } from '@/users/infrastructure/database/prisma/testing/setup-prisma-tests';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { ForbiddenError } from '@/shared/domain/errors/forbidden-error';

describe('DeleteProductUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: DeleteProductUseCase.UseCase;
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
    sut = new DeleteProductUseCase.UseCase(repository);
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
    await expect(() =>
      sut.execute({ id: 'fakeId', user_id: userEntity.id }),
    ).rejects.toThrow(new NotFoundError('ProductModel not found'));
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
        await sut.execute({ id: productEntity.id, user_id: userEntity.id }),
    ).rejects.toThrow(
      new ForbiddenError('You do not have permission to perform this action'),
    );
  });

  it('Should delete a product', async () => {
    const entity = new ProductEntity({
      ...ProductDataBuilder({}),
      user_id: userEntity.id,
    });
    await prismaService.product.create({
      data: entity.toJSON(),
    });
    await sut.execute({ id: entity.id, user_id: entity.user_id });

    const output = await prismaService.product.findUnique({
      where: {
        id: entity.id,
      },
    });
    expect(output).toBeNull();

    const models = await prismaService.product.findMany();
    expect(models).toHaveLength(0);
  });
});
