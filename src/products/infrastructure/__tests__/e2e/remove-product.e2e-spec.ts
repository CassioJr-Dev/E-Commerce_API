import {
  AuthService,
  GenerateJwtProps,
} from '@/auth/infrastructure/auth.service';
import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { setupPrismaTests } from '@/shared/infrastructure/database/testing/setup-prisma-tests';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { ProductsModule } from '../../products.module';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { applyGlobalConfig } from '@/global-config';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';

describe('ProductsController e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: ProductRepository.Repository;
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
  });

  describe('DELETE /products/:id', () => {
    it('Should remove a product', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/products/${entity._id}`)
        .set('Authorization', accessToken)
        .expect(204)
        .expect({});
    });

    it('Should return a error with 404 code when throw NotFoundError with invalid id', async () => {
      const res = await request(app.getHttpServer())
        .delete('/products/fakeId')
        .set('Authorization', accessToken)
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'ProductModel not found',
        });
    });

    it('Should return a error with 422 code when authorization header not provided', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/products/${entity._id}`)
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
        .delete(`/products/${productEntity.id}`)
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
