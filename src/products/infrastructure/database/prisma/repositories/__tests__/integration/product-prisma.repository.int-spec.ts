import { PrismaClient } from '@prisma/client';
import { ProductPrismaRepository } from '../../product-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTests } from '@/users/infrastructure/database/prisma/testing/setup-prisma-tests';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';

describe('ProductPrismaRepository integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: ProductPrismaRepository;
  let module: TestingModule;
  let userEntity: UserEntity;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
  });

  beforeEach(async () => {
    sut = new ProductPrismaRepository(prismaService as any);

    await prismaService.product.deleteMany();
    await prismaService.user.deleteMany();

    userEntity = new UserEntity({ ...UserDataBuilder({}), isSeller: true });
    await prismaService.user.create({
      data: userEntity,
    });
  });

  afterAll(async () => {
    await prismaService.product.deleteMany();
  });

  it('Should throws error when entity not found', async () => {
    await expect(() => sut.findById('FakeId')).rejects.toThrow(
      new NotFoundError('ProductModel not found'),
    );
  });

  it('Should finds a entity by id', async () => {
    const entity = new ProductEntity({
      ...ProductDataBuilder({}),
      user_id: userEntity.id,
    });

    const newProduct = await prismaService.product.create({
      data: entity.toJSON(),
    });

    const output = await sut.findById(newProduct.id);

    expect(output.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('Should insert a new entity', async () => {
    const entity = new ProductEntity({
      ...ProductDataBuilder({}),
      user_id: userEntity.id,
    });
    await sut.insert(entity);

    const product = await prismaService.product.findUnique({
      where: {
        id: entity._id,
      },
    });
    const result = { ...product, price: Number(product.price.toString()) };
    expect(result).toStrictEqual(entity.toJSON());
  });

  it('Should returns all users', async () => {
    const entity = new ProductEntity({
      ...ProductDataBuilder({}),
      user_id: userEntity.id,
    });
    await prismaService.product.create({
      data: entity.toJSON(),
    });

    const entities = await sut.findAll(entity.user_id);

    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
    entities.map(item => expect(item.toJSON()).toStrictEqual(entity.toJSON()));
  });

  it('Should throws error on update when a entity not found', async () => {
    const entity = new ProductEntity({
      ...ProductDataBuilder({}),
      user_id: userEntity.id,
    });

    await expect(() => sut.update(entity)).rejects.toThrow(
      new NotFoundError(`ProductModel not found`),
    );
  });

  it('Should update a entity', async () => {
    const entity = new ProductEntity({
      ...ProductDataBuilder({}),
      user_id: userEntity.id,
    });
    const newProduct = await prismaService.product.create({
      data: entity.toJSON(),
    });
    entity.updateName('new name');
    await sut.update(entity);

    const output = await prismaService.product.findUnique({
      where: {
        id: entity.id,
      },
    });

    expect(output.name).toBe(`new name`);
  });

  it('Should throws error on delete when entity not found', async () => {
    const entity = new ProductEntity({
      ...ProductDataBuilder({}),
      user_id: userEntity.id,
    });
    await expect(() => sut.delete(entity.id, entity.user_id)).rejects.toThrow(
      new NotFoundError(`ProductModel not found`),
    );
  });

  it('Should delete a entity', async () => {
    const entity = new ProductEntity({
      ...ProductDataBuilder({}),
      user_id: userEntity.id,
    });
    const newProduct = await prismaService.product.create({
      data: entity.toJSON(),
    });
    await sut.delete(entity.id, entity.user_id);

    const output = await prismaService.product.findUnique({
      where: {
        id: entity.id,
      },
    });

    expect(output).toBeNull();
  });

  // describe('Search method tests', () => {
  //   it('Should apply only pagination when the other params are null', async () => {
  //     const created_at = new Date();
  //     const entities: ProductEntity[] = [];

  //     const arrange = Array(16).fill(ProductDataBuilder({}));
  //     arrange.forEach((element, index) => {
  //       entities.push(
  //         new ProductEntity(
  //           {
  //             ...element,
  //             name: `User${index}`,
  //             email: `test${index}@gmail.com`,
  //           },
  //           undefined,
  //           new Date(created_at.getTime() + index),
  //         ),
  //       );
  //     });
  //     await prismaService.product.createMany({
  //       data: entities.map(item => item.toJSON()),
  //     });

  //     const searchOutput = await sut.search(new ProductRepository.SearchParams());

  //     const items = searchOutput.items;

  //     expect(searchOutput).toBeInstanceOf(ProductRepository.SearchResult);
  //     expect(searchOutput.total).toBe(16);
  //     expect(searchOutput.items.length).toBe(15);

  //     searchOutput.items.forEach(item => {
  //       expect(item).toBeInstanceOf(ProductEntity);
  //     });

  //     items.reverse().forEach((item, index) => {
  //       expect(`test${index + 1}@gmail.com`).toBe(item.email);
  //     });
  //   });

  //   it('Should search using filter, sort and paginate', async () => {
  //     const created_at = new Date();
  //     const entities: ProductEntity[] = [];

  //     const arrange = ['test', 'a', 'TEST', 'b', 'TeSt'];

  //     arrange.forEach((element, index) => {
  //       entities.push(
  //         new ProductEntity(
  //           {
  //             ...ProductDataBuilder({ name: element }),
  //           },
  //           undefined,
  //           new Date(created_at.getTime() + index),
  //         ),
  //       );
  //     });

  //     await prismaService.product.createMany({
  //       data: entities.map(item => item.toJSON()),
  //     });

  //     const searchOutputPage1 = await sut.search(
  //       new ProductRepository.SearchParams({
  //         page: 1,
  //         perPage: 3,
  //         sort: 'name',
  //         sortDir: 'asc',
  //         filter: 'TEST',
  //       }),
  //     );

  //     console.log(searchOutputPage1.items);
  //     console.log(searchOutputPage1.sortDir);
  //     expect(searchOutputPage1.items[0].toJSON()).toMatchObject(
  //       entities[0].toJSON(),
  //     );
  //     expect(searchOutputPage1.items[1].toJSON()).toMatchObject(
  //       entities[4].toJSON(),
  //     );

  //     const searchOutputPage2 = await sut.search(
  //       new ProductRepository.SearchParams({
  //         page: 2,
  //         perPage: 2,
  //         sort: 'name',
  //         sortDir: 'asc',
  //         filter: 'TEST',
  //       }),
  //     );

  //     expect(searchOutputPage2.items[0].toJSON()).toMatchObject(
  //       entities[2].toJSON(),
  //     );
  //   });
  // });
});
