import { CartAndCartItemRepository } from '@/cart/domain/repositories/cart.repository';
import { setupPrismaTests } from '@/shared/infrastructure/database/testing/setup-prisma-tests';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { CartModule } from '../../cart.module';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { applyGlobalConfig } from '@/global-config';
import { AuthService } from '@/auth/infrastructure/auth.service';
import { AuthModule } from '@/auth/infrastructure/auth.module';
import { CartController } from '../../cart.controller';
import { instanceToPlain } from 'class-transformer';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import request from 'supertest';

describe('CartController e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: CartAndCartItemRepository.Repository;
  let user_id: string;
  let accessToken: string;
  let authService: AuthService;
  let user: UserEntity;
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
    accessToken = (await authService.generateJwt(user_id)).accessToken;
    await prismaService.cart.deleteMany();
    await prismaService.cartItem.deleteMany();
    await prismaService.user.deleteMany();

    user = new UserEntity({ ...UserDataBuilder({}) }, user_id);
    await prismaService.user.create({ data: user });
  });

  afterAll(async () => {
    await prismaService.cart.deleteMany();
    await prismaService.cartItem.deleteMany();
    await prismaService.user.deleteMany();
  });

  describe('POST /cart/createCart', () => {
    it('Should create a cart', async () => {
      const res = await request(app.getHttpServer())
        .post('/cart/createCart')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      expect(Object.keys(res.body)).toStrictEqual(['data']);
      const cart = await repository.findCart(
        res.body.data.cart.id,
        res.body.data.cart.user_id,
      );
      const presenter = CartController.cartToResponse(cart.toJSON());
      const serialized = instanceToPlain(presenter);

      expect(res.body.data.cart).toStrictEqual(serialized);
    });

    it('Should return a error with 422 code when Authorization header not provided', async () => {
      const res = await request(app.getHttpServer())
        .post('/cart/createCart')
        .expect(401);
      expect(res.body.message).toEqual('Unauthorized');
    });
  });
});
