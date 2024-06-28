import { CreateProductUseCase } from '@/products/application/usecases/create-product.usecase';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto
  implements Omit<CreateProductUseCase.Input, 'user_id'>
{
  @ApiProperty({ description: 'Nome do produto' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Descrição do produto' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Preço do produto' })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: 'Estoque do produto' })
  @IsNumber()
  @IsNotEmpty()
  stock: number;
}
