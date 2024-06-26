import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDto } from '../../dtos/create-product.dto';
import { setupPrismaTests } from '@/users/infrastructure/database/prisma/testing/setup-prisma-tests';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { ProductsModule } from '../../products.module';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { PrismaClient } from '@prisma/client';
import { applyGlobalConfig } from '@/global-config';
import request from 'supertest';
import { ProductsController } from '../../products.controller';
import { instanceToPlain } from 'class-transformer';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { AuthModule } from '@/auth/infrastructure/auth.module';
import { AuthService } from '@/auth/infrastructure/auth.service';

describe('ProductsController e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: ProductRepository.Repository;
  let createProductDto: CreateProductDto;
  const prismaService = new PrismaClient();
  let user: UserEntity;
  let authService: AuthService;
  let generateJwt;
  let jwt: string;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule,
        ProductsModule,
        DatabaseModule.forTest(prismaService),
        AuthModule,
      ],
    }).compile();
    app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();
    repository = module.get<ProductRepository.Repository>('ProductRepository');

    authService = module.get(AuthService);
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();
    await prismaService.product.deleteMany();

    user = new UserEntity({ ...UserDataBuilder({}), isSeller: true });
    await prismaService.user.create({ data: user });

    createProductDto = {
      name: 'test name',
      description: 'test description',
      price: 10,
      stock: 5,
    };

    generateJwt = await authService.generateJwt(user.id);
    jwt = `Bearer ${generateJwt.accessToken} `;
  });

  afterAll(async () => {
    await prismaService.user.deleteMany();
    await prismaService.product.deleteMany();
  });

  describe('POST /products', () => {
    it('Should create a product', async () => {
      const res = await request(app.getHttpServer())
        .post('/products')
        .set('authorization', jwt)
        .send(createProductDto)
        .expect(201);

      expect(Object.keys(res.body)).toStrictEqual(['data']);
      const product = await repository.findById(res.body.data.product.id);
      const presenter = ProductsController.productToResponse(product.toJSON());
      const serialized = instanceToPlain(presenter);

      expect(res.body.data.product).toStrictEqual(serialized);
    });

    it('Should return a error with 422 code when the request body is invalid', async () => {
      const res = await request(app.getHttpServer())
        .post('/products')
        .set('authorization', jwt)
        .send({})
        .expect(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'name should not be empty',
        'name must be a string',
        'price should not be empty',
        'price must be a number conforming to the specified constraints',
        'stock should not be empty',
        'stock must be a number conforming to the specified constraints',
      ]);
    });

    it('should return a error with 422 code when the name field is invalid', async () => {
      delete createProductDto.name;
      const res = await request(app.getHttpServer())
        .post('/products')
        .set('authorization', jwt)
        .send(createProductDto)
        .expect(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'name should not be empty',
        'name must be a string',
      ]);
    });

    it('should return a error with 422 code when the price field is invalid', async () => {
      delete createProductDto.price;
      const res = await request(app.getHttpServer())
        .post('/products')
        .set('authorization', jwt)
        .send(createProductDto)
        .expect(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'price should not be empty',
        'price must be a number conforming to the specified constraints',
      ]);
    });

    it('Should return a error with 422 code when the stock field is invalid', async () => {
      delete createProductDto.stock;
      const res = await request(app.getHttpServer())
        .post('/products')
        .set('authorization', jwt)
        .send(createProductDto)
        .expect(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'stock should not be empty',
        'stock must be a number conforming to the specified constraints',
      ]);
    });

    it('Should return a error with 422 code with invalid field provided', async () => {
      const res = await request(app.getHttpServer())
        .post('/products')
        .set('authorization', jwt)
        .send(Object.assign(createProductDto, { xpto: 'fake' }))
        .expect(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual(['property xpto should not exist']);
    });

    it('Should return a error with 422 code when authorization header not provided', async () => {
      const res = await request(app.getHttpServer())
        .post('/products')
        .send(createProductDto)
        .expect(401);
      expect(res.body.message).toEqual('Unauthorized');
    });

    it('Should return a error with 403 code when user not is seller', async () => {
      const userEntity = new UserEntity(UserDataBuilder({}));
      await prismaService.user.create({ data: userEntity });

      const generate = await authService.generateJwt(userEntity.id);
      const accessToken = `Bearer ${generate.accessToken} `;

      const res = await request(app.getHttpServer())
        .post('/products')
        .send(createProductDto)
        .set('authorization', accessToken)
        .expect(403)
        .expect({
          statusCode: 403,
          error: 'Forbidden',
          message: 'You do not have permission to perform this action',
        });
    });
  });
});
