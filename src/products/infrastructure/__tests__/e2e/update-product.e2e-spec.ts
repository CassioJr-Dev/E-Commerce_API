import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { UpdateProductDto } from '../../dtos/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { ProductEntity } from '@/products/domain/entities/product.entity';
import {
  AuthService,
  GenerateJwtProps,
} from '@/auth/infrastructure/auth.service';
import { setupPrismaTests } from '@/shared/infrastructure/database/testing/setup-prisma-tests';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { ProductsModule } from '../../products.module';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { applyGlobalConfig } from '@/global-config';
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { ProductsController } from '../../products.controller';
import { instanceToPlain } from 'class-transformer';

describe('ProductsController unit tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: ProductRepository.Repository;
  let updateProductDto: UpdateProductDto;
  const prismaService = new PrismaClient();
  let entity: ProductEntity;
  let userEntity: UserEntity;
  let authService: AuthService;
  let accessToken: string;
  let generateJwt: GenerateJwtProps;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule,
        ProductsModule,
        DatabaseModule.forTest(prismaService),
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

    entity = new ProductEntity({
      ...ProductDataBuilder({}),
      user_id: userEntity.id,
    });
    await prismaService.product.create({ data: entity });

    generateJwt = await authService.generateJwt(userEntity.id);
    accessToken = `Bearer ${generateJwt.accessToken} `;

    const { user_id, ...rest } = ProductDataBuilder({});
    updateProductDto = rest;
  });

  describe('PUT /products/:id', () => {
    it('Should update a product', async () => {
      const res = await request(app.getHttpServer())
        .put(`/products/${entity._id}`)
        .set('Authorization', accessToken)
        .send(updateProductDto)
        .expect(200);
      const product = await repository.findById(entity._id);
      const presenter = ProductsController.productToResponse(product.toJSON());
      const serialized = instanceToPlain(presenter);
      expect(res.body.data.product).toStrictEqual(serialized);
    });

    it('Should return a error with 400 code when the request body is invalid', async () => {
      const res = await request(app.getHttpServer())
        .put(`/products/${entity._id}`)
        .set('Authorization', accessToken)
        .send({})
        .expect(400);
      expect(res.body.error).toBe('Bad Request');
      expect(res.body.message).toEqual('No valid properties provided');
    });

    it('Should return a error with 404 code when throw NotFoundError with invalid id', async () => {
      const res = await request(app.getHttpServer())
        .put('/products/fakeId')
        .set('Authorization', accessToken)
        .send(updateProductDto)
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'ProductModel not found',
        });
    });

    it('should return a error with 404 code when ProductModel not found', async () => {
      const res = await request(app.getHttpServer())
        .put(`/products/fakeId`)
        .set('Authorization', accessToken)
        .send(updateProductDto)
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'ProductModel not found',
        });
    });

    it('Should return a error with 422 code when authorization header not provided', async () => {
      const res = await request(app.getHttpServer())
        .put(`/products/${entity._id}`)
        .expect(401);
      expect(res.body.message).toEqual('Unauthorized');
    });

    it('Should return a error with 403 code when user not is seller', async () => {
      const productEntity = new ProductEntity({
        ...ProductDataBuilder({}),
        user_id: userEntity.id,
      });
      await prismaService.product.create({ data: productEntity });

      await prismaService.user.update({
        data: { isSeller: false },
        where: { id: userEntity.id },
      });

      const generate = await authService.generateJwt(userEntity.id);
      const newAccessToken = `Bearer ${generate.accessToken} `;

      const res = await request(app.getHttpServer())
        .put(`/products/${productEntity.id}`)
        .send(updateProductDto)
        .set('Authorization', newAccessToken)
        .expect(403)
        .expect({
          statusCode: 403,
          error: 'Forbidden',
          message: 'You do not have permission to perform this action',
        });
    });
  });
});
