import { CreateProductUseCase } from '@/products/application/usecases/create-product.usecase';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SignupDto implements CreateProductUseCase.Input {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
  s;
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsString()
  @IsNotEmpty()
  user_id: string;
}
