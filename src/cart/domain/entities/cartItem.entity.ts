import { Entity } from '@/shared/domain/entities/entity';
import { CartItemValidatorFactory } from '../validators/cartItem-validator';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';

export type CartItemProps = {
  cart_id: string;
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
    CartItemEntity.validate(props);
    super(props, id, created_at, updated_at);
  }

  updateQuantity(value: number) {
    CartItemEntity.validate({ ...this.props, quantity: value });
    this.quantity = value;
    this.updated_at = this.toDate();
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

  static validate(props: CartItemProps) {
    const validator = CartItemValidatorFactory.create();
    const isValidate = validator.validate(props);
    if (!isValidate) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
