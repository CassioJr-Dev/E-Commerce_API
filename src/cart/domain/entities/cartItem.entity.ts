import { Entity } from '@/shared/domain/entities/entity';

export type CartItemProps = {
  cart_id: string
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

  get cart_id() {
    return this.props.cart_id;
  }

  set cart_id(value: string) {
    this.props.cart_id = value;
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
