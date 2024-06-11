import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ProductProps } from '../entities/product.entity';
import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fileds';

export class ProductRules {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  name: string;

  @MaxLength(255)
  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsString()
  @IsNotEmpty()
  user_id: string;

  constructor({ name, description, price, stock, user_id }: ProductProps) {
    Object.assign(this, { name, description, price, stock, user_id });
  }
}

export class ProductValidator extends ClassValidatorFields<ProductRules> {
  validate(data: ProductRules): boolean {
    return super.validate(new ProductRules(data ?? ({} as ProductProps)));
  }
}

export class ProductValidatorFactory {
  static create(): ProductValidator {
    return new ProductValidator();
  }
}
