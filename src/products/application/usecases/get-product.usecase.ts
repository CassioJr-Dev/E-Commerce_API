import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case';
import { ProductOutput, ProductOutputMapper } from '../dtos/product-output';
import { ProductRepository } from '@/products/domain/repositories/product.repository';

export namespace GetProductUseCase {
  export type Input = {
    id: string;
  };

  export type Output = ProductOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private productRepository: ProductRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const entity = await this.productRepository.findById(input.id);
      return ProductOutputMapper.toOutput(entity);
    }
  }
}
