import { UpdateProductUseCase } from '@/products/application/usecases/update-product.usecase';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto
  implements Omit<UpdateProductUseCase.Input, 'id'>
{
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsNotEmpty()
  @IsString()
  user_id: string;
}
