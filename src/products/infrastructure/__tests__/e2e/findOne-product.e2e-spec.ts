import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { setupPrismaTests } from '@/users/infrastructure/database/prisma/testing/setup-prisma-tests';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { ProductsModule } from '../../products.module';
import { AuthModule } from '@/auth/infrastructure/auth.module';
import { applyGlobalConfig } from '@/global-config';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import {
  AuthService,
  GenerateJwtProps,
} from '@/auth/infrastructure/auth.service';
import { ProductsController } from '../../products.controller';
import { instanceToPlain } from 'class-transformer';
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

    entity = new ProductEntity({
      ...ProductDataBuilder({}),
      user_id: userEntity.id,
    });
    await prismaService.product.create({ data: entity });

    generateJwt = await authService.generateJwt(userEntity.id);
    accessToken = `Bearer ${generateJwt.accessToken} `;
  });

  describe('GET /products/:id', () => {
    it('Should get a product', async () => {
      const res = await request(app.getHttpServer())
        .get(`/products/${entity._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      const presenter = ProductsController.productToResponse(entity.toJSON());
      const serialized = instanceToPlain(presenter);
      expect(res.body.data.product).toStrictEqual(serialized);
    });

    it('Should return a error with 404 code when throw NotFoundError with invalid id', async () => {
      const res = await request(app.getHttpServer())
        .get('/products/fakeId')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'ProductModel not found',
        });
    });
  });
});
