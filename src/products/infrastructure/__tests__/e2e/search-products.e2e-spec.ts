import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { setupPrismaTests } from '@/users/infrastructure/database/prisma/testing/setup-prisma-tests';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { ProductsModule } from '../../products.module';
import { applyGlobalConfig } from '@/global-config';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { instanceToPlain } from 'class-transformer';
import { ProductsController } from '../../products.controller';
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import {
  AuthService,
  GenerateJwtProps,
} from '@/auth/infrastructure/auth.service';
import { AuthModule } from '@/auth/infrastructure/auth.module';
import request from 'supertest';

describe('UsersController e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: ProductRepository.Repository;
  const prismaService = new PrismaClient();
  let authService: AuthService;
  let userEntity: UserEntity;
  let generateJwt: GenerateJwtProps;
  let accessToken: string;

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

    userEntity = new UserEntity({ ...UserDataBuilder({}), isSeller: true });
    await prismaService.user.create({ data: userEntity });

    generateJwt = await authService.generateJwt(userEntity.id);
    accessToken = `Bearer ${generateJwt.accessToken} `;
  });

  describe('GET /products', () => {
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
              name: `name${index}`,
            },
            undefined,
            new Date(created_at.getTime() + index),
          ),
        );
      });
      await prismaService.product.deleteMany();
      await prismaService.product.createMany({
        data: entities.map(item => item.toJSON()),
      });
      const searchParams = {};
      const queryParams = new URLSearchParams(searchParams as any).toString();

      const res = await request(app.getHttpServer())
        .get(`/products/?${queryParams}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      expect(Object.keys(res.body)).toStrictEqual(['data', 'meta']);
      expect(res.body).toStrictEqual({
        data: [...entities]
          .reverse()
          .map(item =>
            instanceToPlain(ProductsController.productToResponse(item)),
          ),
        meta: {
          total: 3,
          currentPage: 1,
          perPage: 15,
          lastPage: 1,
        },
      });
    });

    it('Should return the products ordered by name', async () => {
      const entities: ProductEntity[] = [];
      const arrange = ['test', 'a', 'TEST', 'b', 'TeSt'];
      arrange.forEach((element, index) => {
        entities.push(
          new ProductEntity({
            ...ProductDataBuilder({}),
            name: element,
            user_id: userEntity._id,
          }),
        );
      });
      await prismaService.product.createMany({
        data: entities.map(item => item.toJSON()),
      });
      const searchParams = {
        page: 1,
        perPage: 2,
        sort: 'name',
        sortDir: 'asc',
        filter: 'TEST',
      };
      const queryParams = new URLSearchParams(searchParams as any).toString();

      const res = await request(app.getHttpServer())
        .get(`/products/?${queryParams}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Object.keys(res.body)).toStrictEqual(['data', 'meta']);
      expect(res.body).toStrictEqual({
        data: [entities[0], entities[4]].map(item =>
          instanceToPlain(ProductsController.productToResponse(item)),
        ),
        meta: {
          total: 3,
          currentPage: 1,
          perPage: 2,
          lastPage: 2,
        },
      });
    });
    it('Should return the products ordered by price', async () => {
      const entities: ProductEntity[] = [];
      const arrange = [50, 40, 30, 20, 10];
      const arrangeName = ['test', 'a', 'TEST', 'b', 'TeSt'];
      arrange.forEach((element, index) => {
        entities.push(
          new ProductEntity({
            ...ProductDataBuilder({}),
            name: arrangeName[index],
            price: element,
            user_id: userEntity._id,
          }),
        );
      });
      await prismaService.product.createMany({
        data: entities.map(item => item.toJSON()),
      });
      const searchParams = {
        page: 1,
        perPage: 2,
        sort: 'price',
        sortDir: 'asc',
        filter: 'TEST',
      };
      const queryParams = new URLSearchParams(searchParams as any).toString();

      const res = await request(app.getHttpServer())
        .get(`/products/?${queryParams}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Object.keys(res.body)).toStrictEqual(['data', 'meta']);
      expect(res.body).toStrictEqual({
        data: [entities[4], entities[2]].map(item =>
          instanceToPlain(ProductsController.productToResponse(item)),
        ),
        meta: {
          total: 3,
          currentPage: 1,
          perPage: 2,
          lastPage: 2,
        },
      });
    });

    it('Should return a error with 422 code when the query params is invalid', async () => {
      const res = await request(app.getHttpServer())
        .get('/products/?fakeId=10')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual(['property fakeId should not exist']);
    });
  });
});
