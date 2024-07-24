import { AuthModule } from '@/auth/infrastructure/auth.module';
import { AuthService } from '@/auth/infrastructure/auth.service';
import { CartAndCartItemRepository } from '@/cart/domain/repositories/cart.repository';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { setupPrismaTests } from '@/shared/infrastructure/database/testing/setup-prisma-tests';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { CartModule } from '../../cart.module';
import { applyGlobalConfig } from '@/global-config';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { CartEntity } from '@/cart/domain/entities/cart.entity';
import request from 'supertest';
import { AddItemToCartDto } from '../../dtos/addItem-cart.dto';
import { CartItemEntity } from '@/cart/domain/entities/cartItem.entity';
import { CartController } from '../../cart.controller';
import { instanceToPlain } from 'class-transformer';
import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';

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
  let addItemToCartDto: AddItemToCartDto;
  const prismaService = new PrismaClient();

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule,
        CartModule,
        DatabaseModule.forTest(prismaService),
        AuthModule,
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

    addItemToCartDto = {
      cart_id: cart.id,
      product_id: product.id,
      quantity: 10,
    };
  });

  afterAll(async () => {
    await prismaService.user.deleteMany();
    await prismaService.cart.deleteMany();
    await prismaService.cartItem.deleteMany();
  });

  describe('POST /cart', () => {
    it('Should addItem to cart', async () => {
      const res = await request(app.getHttpServer())
        .post('/cart')
        .set('Authorization', accessToken)
        .send(addItemToCartDto)
        .expect(201);

      expect(Object.keys(res.body)).toStrictEqual(['data']);
      const cartItem = await repository.findAll(
        res.body.data.cartItem.cart_id,
        user_id,
      );
      const presenter = CartController.cartItemToResponse(cartItem[0].toJSON());
      const serialized = instanceToPlain(presenter);

      expect(res.body.data.cartItem).toStrictEqual(serialized);
    });

    it('Should return a error with 422 code when the request body is invalid', async () => {
      const res = await request(app.getHttpServer())
        .post('/cart')
        .set('Authorization', accessToken)
        .send({})
        .expect(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'cart_id should not be empty',
        'cart_id must be a string',
        'product_id should not be empty',
        'product_id must be a string',
        'quantity should not be empty',
        'quantity must be a number conforming to the specified constraints',
      ]);
    });

    it('should return a error with 422 code when the cart_id field is invalid', async () => {
      delete addItemToCartDto.cart_id;
      const res = await request(app.getHttpServer())
        .post('/cart')
        .set('Authorization', accessToken)
        .send(addItemToCartDto)
        .expect(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'cart_id should not be empty',
        'cart_id must be a string',
      ]);
    });

    it('should return a error with 422 code when the price field is invalid', async () => {
      delete addItemToCartDto.product_id;
      const res = await request(app.getHttpServer())
        .post('/cart')
        .set('Authorization', accessToken)
        .send(addItemToCartDto)
        .expect(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'product_id should not be empty',
        'product_id must be a string',
      ]);
    });

    it('Should return a error with 422 code when the quantity field is invalid', async () => {
      delete addItemToCartDto.quantity;
      const res = await request(app.getHttpServer())
        .post('/cart')
        .set('Authorization', accessToken)
        .send(addItemToCartDto)
        .expect(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'quantity should not be empty',
        'quantity must be a number conforming to the specified constraints',
      ]);
    });

    it('Should return a error with 422 code when Authorization header not provided', async () => {
      const res = await request(app.getHttpServer())
        .post('/cart')
        .send(addItemToCartDto)
        .expect(401);
      expect(res.body.message).toEqual('Unauthorized');
    });
  });
});
