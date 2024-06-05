import { Entity } from '@/shared/domain/entities/entity';

export type ProductProps = {
  name: string;
  description?: string;
  price: number;
  user_id: string;
};

export class ProductEntity extends Entity<ProductProps> {
  constructor(
    public readonly props: ProductProps,
    id?: string,
    created_at?: Date,
    updated_at?: Date,
  ) {
    super(props, id, created_at, updated_at);
  }

  get name() {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  get description() {
    return this.props.description;
  }

  private set description(value: string) {
    this.props.description = value;
  }

  get price() {
    return this.props.price;
  }

  private set price(value: number) {
    this.props.price = value;
  }

  get user_id() {
    return this.props.user_id;
  }

  private set user_id(value: string) {
    this.props.user_id = value;
  }
}
