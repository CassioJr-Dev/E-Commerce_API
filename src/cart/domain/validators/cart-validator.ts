import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { CartProps } from '../entities/cart.entity';
import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fileds';

export class CartRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  user_id: string;
  constructor({ user_id }: CartProps) {
    Object.assign(this, { user_id });
  }
}

export class CartValidator extends ClassValidatorFields<CartRules> {
  validate(data: CartRules): boolean {
    return super.validate(new CartRules(data ?? ({} as CartProps)));
  }
}

export class CartValidatorFactory {
  static create(): CartValidator {
    return new CartValidator();
  }
}
