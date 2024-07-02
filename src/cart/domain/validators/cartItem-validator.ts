import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { CartItemProps } from '../entities/cartItem.entity';
import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fileds';

export class CartItemRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  cart_id: string;

  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  product_id: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  constructor({ cart_id, product_id, quantity }: CartItemProps) {
    Object.assign(this, { cart_id, product_id, quantity });
  }
}

export class CartItemValidator extends ClassValidatorFields<CartItemRules> {
  validate(data: CartItemRules): boolean {
    return super.validate(new CartItemRules(data ?? ({} as CartItemProps)));
  }
}

export class CartItemValidatorFactory {
  static create(): CartItemValidator {
    return new CartItemValidator();
  }
}
