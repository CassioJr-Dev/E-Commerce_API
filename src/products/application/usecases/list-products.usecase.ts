import { UserRepository } from '@/users/domain/repositories/user.repository';
import { SearchInput } from '@/shared/application/dtos/search-input';
import { UseCase as DefaultUseCase } from '../../../shared/application/usecases/use-case';
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '@/shared/application/dtos/pagination-output';
import { ProductOutput, ProductOutputMapper } from '../dtos/product-output';
import { ProductRepository } from '@/products/domain/repositories/product.repository';

export namespace ListUsersUseCase {
  export type Input = SearchInput;

  export type Output = PaginationOutput<ProductOutput>;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private productRepository: ProductRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const params = new UserRepository.SearchParams(input);
      const searchResult = await this.productRepository.search(params);
      return this.toOutput(searchResult);
    }

    private toOutput(searchResult: ProductRepository.SearchResult): Output {
      const items = searchResult.items.map(item => {
        return ProductOutputMapper.toOutput(item);
      });

      return PaginationOutputMapper.toOutput(items, searchResult);
    }
  }
}
