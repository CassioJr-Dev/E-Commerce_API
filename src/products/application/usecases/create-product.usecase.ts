import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case';
import { ProductOutput, ProductOutputMapper } from '../dtos/product-output';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { BadRequestError } from '@/shared/domain/errors/bad-request-error';
import { ProductEntity } from '@/products/domain/entities/product.entity';

export namespace CreateProductUseCase {
  export type Input = {
    name: string;
    description?: string;
    price: number;
    stock: number;
    user_id: string;
  };

  export type Output = ProductOutput

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private productRepository: ProductRepository.Repository){}

    async execute(input: Input): Promise<Output> {
      const { name, description = null, price, stock, user_id } = input;

      if (!name || !price || !stock || !user_id) {
        throw new BadRequestError('Input data not provided');
      }

      const entity = new ProductEntity(input)

      await this.productRepository.insert(entity)

      return ProductOutputMapper.toOutput(entity)
    }
  }
}
