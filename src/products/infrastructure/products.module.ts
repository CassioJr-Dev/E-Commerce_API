import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { AuthModule } from '@/auth/infrastructure/auth.module';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { ProductPrismaRepository } from './database/prisma/repositories/product-prisma.repository';
import { CreateProductUseCase } from '../application/usecases/create-product.usecase';
import { ProductRepository } from '../domain/repositories/product.repository';
import { GetProductUseCase } from '../application/usecases/get-product.usecase';
import { ListProductsUseCase } from '../application/usecases/list-products.usecase';
import { UpdateProductUseCase } from '../application/usecases/update-product.usecase';
import { DeleteProductUseCase } from '../application/usecases/delete-product.usecase';

@Module({
  imports: [AuthModule],
  controllers: [ProductsController],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'ProductRepository',
      useFactory: (prismaService: PrismaService) => {
        return new ProductPrismaRepository(prismaService);
      },
      inject: ['PrismaService'],
    },
    {
      provide: CreateProductUseCase.UseCase,
      useFactory: (productRepository: ProductRepository.Repository) => {
        return new CreateProductUseCase.UseCase(productRepository);
      },
      inject: ['ProductRepository'],
    },
    {
      provide: GetProductUseCase.UseCase,
      useFactory: (productRepository: ProductRepository.Repository) => {
        return new GetProductUseCase.UseCase(productRepository);
      },
      inject: ['ProductRepository'],
    },
    {
      provide: ListProductsUseCase.UseCase,
      useFactory: (productRepository: ProductRepository.Repository) => {
        return new ListProductsUseCase.UseCase(productRepository);
      },
      inject: ['ProductRepository'],
    },
    {
      provide: UpdateProductUseCase.UseCase,
      useFactory: (productRepository: ProductRepository.Repository) => {
        return new UpdateProductUseCase.UseCase(productRepository);
      },
      inject: ['ProductRepository'],
    },
    {
      provide: DeleteProductUseCase.UseCase,
      useFactory: (productRepository: ProductRepository.Repository) => {
        return new DeleteProductUseCase.UseCase(productRepository);
      },
      inject: ['ProductRepository'],
    },
  ],
})
export class ProductsModule {}
