import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { AuthModule } from '@/auth/infrastructure/auth.module';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { CartPrismaRepository } from './database/prisma/repositories/cart-prisma.repository';
import { AddItemUseCase } from '../application/usecases/addItem.usecase';
import { CartAndCartItemRepository } from '../domain/repositories/cart.repository';
import { CreateCartUseCase } from '../application/usecases/createCart.usecase';
import { DeleteCartUseCase } from '../application/usecases/deleteCart.usecase';
import { DeleteItemUseCase } from '../application/usecases/deleteItem.usecase';
import { GetCartUseCase } from '../application/usecases/getCart.usecase';
import { GetItemsCartUseCase } from '../application/usecases/getItems.usecase';
import { UpdateQuantityUseCase } from '../application/usecases/updateQuantity.usecase';

@Module({
  imports: [AuthModule],
  controllers: [CartController],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'CartRepository',
      useFactory: (prismaService: PrismaService) => {
        return new CartPrismaRepository(prismaService);
      },
      inject: ['PrismaService'],
    },
    {
      provide: AddItemUseCase.UseCase,
      useFactory: (cartRepository: CartAndCartItemRepository.Repository) => {
        return new AddItemUseCase.UseCase(cartRepository);
      },
      inject: ['CartRepository'],
    },
    {
      provide: CreateCartUseCase.UseCase,
      useFactory: (cartRepository: CartAndCartItemRepository.Repository) => {
        return new CreateCartUseCase.UseCase(cartRepository);
      },
      inject: ['CartRepository'],
    },
    {
      provide: DeleteCartUseCase.UseCase,
      useFactory: (cartRepository: CartAndCartItemRepository.Repository) => {
        return new DeleteCartUseCase.UseCase(cartRepository);
      },
      inject: ['CartRepository'],
    },
    {
      provide: DeleteItemUseCase.UseCase,
      useFactory: (cartRepository: CartAndCartItemRepository.Repository) => {
        return new DeleteItemUseCase.UseCase(cartRepository);
      },
      inject: ['CartRepository'],
    },
    {
      provide: GetCartUseCase.UseCase,
      useFactory: (cartRepository: CartAndCartItemRepository.Repository) => {
        return new GetCartUseCase.UseCase(cartRepository);
      },
      inject: ['CartRepository'],
    },
    {
      provide: GetItemsCartUseCase.UseCase,
      useFactory: (cartRepository: CartAndCartItemRepository.Repository) => {
        return new GetItemsCartUseCase.UseCase(cartRepository);
      },
      inject: ['CartRepository'],
    },
    {
      provide: UpdateQuantityUseCase.UseCase,
      useFactory: (cartRepository: CartAndCartItemRepository.Repository) => {
        return new UpdateQuantityUseCase.UseCase(cartRepository);
      },
      inject: ['CartRepository'],
    },
  ],
})
export class CartModule {}
