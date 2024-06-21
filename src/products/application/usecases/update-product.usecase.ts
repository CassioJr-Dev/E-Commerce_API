import { UseCase as DefaultUseCase } from '../../../shared/application/usecases/use-case';
import { BadRequestError } from '@/shared/domain/errors/bad-request-error';
import { ProductOutput, ProductOutputMapper } from '../dtos/product-output';
import { ProductRepository } from '@/products/domain/repositories/product.repository';

export namespace UpdateProductUseCase {
  export type Input = {
    id: string;
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
    user_id: string;
  };

  export type Output = ProductOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private productRepository: ProductRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const { id, name, description, price, stock, user_id } = input;

      const isAllNull = !name && !description && !price && !stock;

      if (isAllNull) {
        throw new BadRequestError('No valid properties provided');
      }

      const entity = await this.productRepository.findById(id, user_id);

      name && entity.updateName(name);
      description && entity.updateDescription(description);
      price && entity.updatePrice(price);
      stock && entity.updateStock(stock);

      await this.productRepository.update(entity);
      return ProductOutputMapper.toOutput(entity);
    }
  }
}
