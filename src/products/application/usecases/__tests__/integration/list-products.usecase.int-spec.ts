import { PrismaClient } from '@prisma/client';
import { ListProductsUseCase } from '../../list-products.usecase';
import { ProductPrismaRepository } from '@/products/infrastructure/database/prisma/repositories/product-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTests } from '@/shared/infrastructure/database/testing/setup-prisma-tests';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';

describe('ListProductsUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: ListProductsUseCase.UseCase;
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
    sut = new ListProductsUseCase.UseCase(repository);
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
  it('Should return the products ordered by created_at', async () => {
    const created_at = new Date();
    const entities: ProductEntity[] = [];
    const arrange = Array(3).fill({
      ...ProductDataBuilder({}),
      user_id: userEntity.id,
    });
    arrange.forEach((element, index) => {
      entities.push(
        new ProductEntity(
          {
            ...element,
            name: `User${index}`,
          },
          undefined,
          new Date(created_at.getTime() + index),
        ),
      );
    });
    await prismaService.product.createMany({
      data: entities.map(item => item.toJSON()),
    });
    const output = await sut.execute({});
    expect(output).toStrictEqual({
      items: entities.reverse().map(item => item.toJSON()),
      total: 3,
      currentPage: 1,
      perPage: 15,
      lastPage: 1,
    });
  });

  it('Should returns output using filter, sort and paginate', async () => {
    const created_at = new Date();
    const entities: ProductEntity[] = [];
    const arrange = ['test', 'a', 'TEST', 'b', 'TeSt'];
    arrange.forEach((element, index) => {
      entities.push(
        new ProductEntity(
          {
            ...ProductDataBuilder({ name: element }),
            user_id: userEntity.id,
          },
          undefined,
          new Date(created_at.getTime() + index),
        ),
      );
    });

    await prismaService.product.createMany({
      data: entities.map(item => item.toJSON()),
    });

    let output = await sut.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'TEST',
    });

    expect(output).toMatchObject({
      items: [entities[0].toJSON(), entities[4].toJSON()],
      total: 3,
      currentPage: 1,
      perPage: 2,
      lastPage: 2,
    });

    output = await sut.execute({
      page: 2,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'TEST',
    });

    expect(output).toMatchObject({
      items: [entities[2].toJSON()],
      total: 3,
      currentPage: 2,
      perPage: 2,
      lastPage: 2,
    });
  });
});
