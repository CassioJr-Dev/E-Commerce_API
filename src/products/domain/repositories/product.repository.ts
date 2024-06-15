import { ProductEntity } from '../entities/product.entity';
import {
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
  SearchableRepositoryInterface,
} from '@/shared/domain/repositories/searchable-repository-contracts';

export namespace ProductRepository {
  export type Filter = string;

  export class SearchParams extends DefaultSearchParams<Filter> {}

  export class SearchResult extends DefaultSearchResult<
    ProductEntity,
    Filter
  > {}

  export interface Repository
    extends SearchableRepositoryInterface<
      ProductEntity,
      Filter,
      SearchParams,
      SearchResult
    > {}
}
