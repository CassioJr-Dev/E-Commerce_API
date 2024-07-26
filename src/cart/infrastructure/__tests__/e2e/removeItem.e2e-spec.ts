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
import { CartItemEntity } from '@/cart/domain/entities/cartItem.entity';
import { UpdateCartItemDto } from '../../dtos/update-cart.dto';
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
  let cartItem: CartItemEntity;
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

    cartItem = new CartItemEntity({
      cart_id: cart.id,
      product_id: product.id,
      quantity: 5,
    });
    await prismaService.cartItem.create({ data: cartItem });

    accessToken = `Bearer ${(await authService.generateJwt(user_id)).accessToken}`;
  });

  afterAll(async () => {
    await prismaService.user.deleteMany();
    await prismaService.cart.deleteMany();
    await prismaService.cartItem.deleteMany();
  });

  describe('DELETE /cart/:id/item/:id', () => {
    it('Should remove a cart', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/cart/${cart.id}/item/${cartItem.id}`)
        .set('Authorization', `${accessToken}`)
        .expect(204)
        .expect({});
    });

    it('Should return a error with 404 code when throw NotFoundError with invalid ItemId', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/cart/${cart.id}/item/fakeId`)
        .set('Authorization', `${accessToken}`)
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'Item not found',
        });
    });

    it('Should return a error with 404 code when throw NotFoundError with invalid id', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/cart/fakeId/item/${cartItem.id}`)
        .set('Authorization', `${accessToken}`)
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'Cart not found',
        });
    });

    it('Should return a error with 401 code when the request is not authorized', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/cart/${cart.id}/item/${cartItem.id}`)
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });
  });
});
