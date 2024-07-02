import { Entity } from '@/shared/domain/entities/entity';
import { CartValidatorFactory } from '../validators/cart-validator';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';

export type CartProps = {
  user_id: string;
};

export class CartEntity extends Entity<CartProps> {
  constructor(
    public readonly props: CartProps,
    id?: string,
    created_at?: Date,
    updated_at?: Date,
  ) {
    CartEntity.validate(props);
    super(props, id, created_at, updated_at);
  }

  updateDate() {
    this.updated_at = this.toDate();
  }

  get user_id() {
    return this.props.user_id;
  }

  set user_id(value: string) {
    this.props.user_id = value;
  }

  static validate(props: CartProps) {
    const validator = CartValidatorFactory.create();
    const isValidate = validator.validate(props);
    if (!isValidate) {
      throw new EntityValidationError(validator.errors);
    }
  }
}
