import { PrismaClient, Product, User } from '@prisma/client';
import { ValidationError } from '@/shared/domain/errors/validation-error';
import { setupPrismaTests } from '@/users/infrastructure/database/prisma/testing/setup-prisma-tests';
import { ProductModelMapper } from '../../product-model.mapper';
import { ProductEntity } from '@/products/domain/entities/product.entity';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';

describe('UserModelMapper integration tests', () => {
  let prismaService: PrismaClient;
  let productProps: any;
  let userProps: any;

  beforeAll(async () => {
    setupPrismaTests();
    prismaService = new PrismaClient();
    await prismaService.$connect();
  });

  beforeEach(async () => {
    const user_id = 'f20b89e8-1740-49c5-9a5c-3a7b5639fb71';

    await prismaService.product.deleteMany();
    await prismaService.user.deleteMany();

    userProps = new UserEntity(
      {
        ...UserDataBuilder({}),
      },
      user_id,
    );

    await prismaService.user.create({
      data: userProps,
    });

    productProps = {
      id: 'd4255494-f981-4d26-a2a1-35d3f5b8d36a',
      name: 'Test name',
      description: 'description of product',
      price: 10.75,
      stock: 50,
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    };
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('Should throws error when product model is invalid', async () => {
    const model: Product = Object.assign(productProps, { name: null });

    expect(() => {
      ProductModelMapper.toEntity(model);
    }).toThrowError(new ValidationError('An entity not be loaded'));
  });

  it('Should convert a Product model to a product entity', async () => {
    const model: Product = await prismaService.product.create({
      data: productProps,
    });
    const sut = ProductModelMapper.toEntity(model);

    expect(sut).toBeInstanceOf(ProductEntity);

    expect(sut.toJSON()).toStrictEqual(productProps);
  });
});
