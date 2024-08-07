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
import { CartItemPresenter } from '../../presenter/cartItem.presenter';
import { CartItemOutputMapper } from '@/cart/application/dtos/cartItem-output';
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
  let updateCartItemDto: UpdateCartItemDto;
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

    updateCartItemDto = {
      item_id: cartItem.id,
      quantity: 10,
    };
  });

  afterAll(async () => {
    await prismaService.user.deleteMany();
    await prismaService.cart.deleteMany();
    await prismaService.cartItem.deleteMany();
  });

  describe('PATCH /cart/:id', () => {
    it('Should update the quantity', async () => {
      const entitie = new CartItemPresenter(
        CartItemOutputMapper.toOutput(cartItem),
      );

      entitie.quantity = 10;

      const res = await request(app.getHttpServer())
        .patch(`/cart/${cart.id}`)
        .set('Authorization', `${accessToken}`)
        .send(updateCartItemDto)
        .expect(200);

      entitie.updated_at = res.body.data.cartItem.updated_at;

      expect(Object.keys(res.body)).toStrictEqual(['data']);
      expect(Object.keys(res.body.data)).toStrictEqual(['cartItem']);
      expect(res.body.data.cartItem.quantity).toEqual(10);
    });

    it('Should return a error with 422 code when the request body is invalid', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/cart/${cart.id}`)
        .set('Authorization', `${accessToken}`)
        .send({})
        .expect(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'item_id should not be empty',
        'item_id must be a string',
        'quantity should not be empty',
        'quantity must be a number conforming to the specified constraints',
      ]);
    });

    it('Should return a error with 404 code when throw NotFoundError with invalid id', async () => {
      const res = await request(app.getHttpServer())
        .patch('/cart/fakeId')
        .set('Authorization', `${accessToken}`)
        .send(updateCartItemDto)
        .expect(404);
      expect(res.body.error).toBe('Not Found');
      expect(res.body.message).toEqual('Item not found');
    });

    it('Should return a error with 422 code when the item_id field is invalid', async () => {
      delete updateCartItemDto.item_id;
      const res = await request(app.getHttpServer())
        .patch(`/cart/${cart.id}`)
        .set('Authorization', `${accessToken}`)
        .send(updateCartItemDto)
        .expect(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'item_id should not be empty',
        'item_id must be a string',
      ]);
    });

    it('Should return a error with 422 code when the quantity field is invalid', async () => {
      delete updateCartItemDto.quantity;
      const res = await request(app.getHttpServer())
        .patch(`/cart/${cart.id}`)
        .set('Authorization', `${accessToken}`)
        .send(updateCartItemDto)
        .expect(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'quantity should not be empty',
        'quantity must be a number conforming to the specified constraints',
      ]);
    });

    it('Should return a error with 401 code when the request is not authorized', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/cart/${cart.id}`)
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });
  });
});
