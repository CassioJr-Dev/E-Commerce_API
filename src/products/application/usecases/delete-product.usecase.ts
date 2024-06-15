import { UseCase as DefaultUseCase } from '@/shared/application/usecases/use-case';
import { ProductRepository } from '@/products/domain/repositories/product.repository';

export namespace DeleteproductUseCase {
  export type Input = {
    id: string;
  };

  export type Output = void;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private productRepository: ProductRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      await this.productRepository.delete(input.id);
    }
  }
}
