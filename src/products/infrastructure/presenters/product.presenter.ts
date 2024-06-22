import { ProductOutput } from '@/products/application/dtos/product-output';
import { ListProductsUseCase } from '@/products/application/usecases/list-products.usecase';
import { CollectionPresenter } from '@/shared/infrastructure/presenters/collection.presenter';
import { Transform } from 'class-transformer';

export class ProductPresenter {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  user_id: string;
  @Transform(({ value }: { value: Date }) => value.toISOString())
  created_at: Date;
  @Transform(({ value }: { value: Date }) => value.toISOString())
  updated_at: Date;

  constructor(output: ProductOutput) {
    this.id = output.id;
    this.name = output.name;
    this.description = output.description;
    this.price = output.price;
    this.stock = output.stock;
    this.user_id = output.user_id;
    this.created_at = output.created_at;
    this.updated_at = output.updated_at;
  }
}

export class ProductCollectionPresenter extends CollectionPresenter {
  data: ProductPresenter[];

  constructor(output: ListProductsUseCase.Output) {
    const { items, ...paginationProps } = output;
    super(paginationProps);
    this.data = items.map(item => new ProductPresenter(item));
  }
}
