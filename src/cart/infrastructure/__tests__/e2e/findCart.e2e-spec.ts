import { AuthModule } from '@/auth/infrastructure/auth.module';
import { AuthService } from '@/auth/infrastructure/auth.service';
import { CartAndCartItemRepository } from '@/cart/domain/repositories/cart.repository';
import { setupPrismaTests } from '@/shared/infrastructure/database/testing/setup-prisma-tests';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { CartModule } from '../../cart.module';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { applyGlobalConfig } from '@/global-config';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { CartEntity } from '@/cart/domain/entities/cart.entity';
import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import { instanceToPlain } from 'class-transformer';
import { CartPresenter } from '../../presenter/cart.presenter';
import { CartOutputMapper } from '@/cart/application/dtos/cart-output';
import request from 'supertest';

describe('CartController e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: CartAndCartItemRepository.Repository;
  let user_id: string;
  let accessToken: string;
  let authService: AuthService;
  let user: UserEntity;
  let cart: CartEntity;
  let product: ProductEntity;
  const prismaService = new PrismaClient();

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [
        AuthModule,
        EnvConfigModule,
        CartModule,
        DatabaseModule.forTest(prismaService),
      ],
    }).compile();
    app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();
    repository =
      module.get<CartAndCartItemRepository.Repository>('CartRepository');

    authService = module.get(AuthService);
  });

  beforeEach(async () => {
    user_id = '07ff776a-0e59-40ef-9242-6c0910e128b9';

    await prismaService.user.deleteMany();
    await prismaService.cart.deleteMany();
    await prismaService.cartItem.deleteMany();

    user = new UserEntity({ ...UserDataBuilder({}) }, user_id);
    await prismaService.user.create({ data: user });

    cart = new CartEntity({ user_id });
    await prismaService.cart.create({ data: cart });

    const userIsSeller = new UserEntity({
      ...UserDataBuilder({}),
      isSeller: true,
    });
    await prismaService.user.create({ data: userIsSeller });

    product = new ProductEntity({
      ...ProductDataBuilder({}),
      user_id: userIsSeller.id,
    });
    await prismaService.product.create({ data: product });

    accessToken = `Bearer ${(await authService.generateJwt(user_id)).accessToken}`;
  });

  afterAll(async () => {
    await prismaService.user.deleteMany();
    await prismaService.cart.deleteMany();
    await prismaService.cartItem.deleteMany();
  });

  describe('GET /cart/:id', () => {
    it('Should return the cart', async () => {
      const entitie = new CartPresenter(CartOutputMapper.toOutput(cart));
      const res = await request(app.getHttpServer())
        .get(`/cart/${cart.id}`)
        .set('Authorization', `${accessToken}`)
        .expect(200);
      expect(Object.keys(res.body)).toStrictEqual(['data']);
      expect(res.body).toStrictEqual({
        data: { cart: instanceToPlain(entitie) },
      });
    });

    it('Should return a error with 401 code when the request is not authorized', async () => {
      const res = await request(app.getHttpServer())
        .get(`/cart/${cart.id}`)
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });
  });
});
