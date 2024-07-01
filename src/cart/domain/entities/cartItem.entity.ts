import { Entity } from '@/shared/domain/entities/entity';

export type CartItemProps = {
  product_id: string;
  quantity: number;
};

export class CartItemEntity extends Entity<CartItemProps> {
  constructor(
    public readonly props: CartItemProps,
    id?: string,
    created_at?: Date,
    updated_at?: Date,
  ) {
    super(props, id, created_at, updated_at);
  }

  get product_id() {
    return this.props.product_id;
  }

  set product_id(value: string) {
    this.props.product_id = value;
  }

  get quantity() {
    return this.props.quantity;
  }

  set quantity(value: number) {
    this.props.quantity = value;
  }
}
