import { UpdateProductUseCase } from '@/products/application/usecases/update-product.usecase';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto
  implements Omit<UpdateProductUseCase.Input, 'id' | 'user_id'>
{
  @ApiProperty({ description: 'Nome do produto' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Descrição do produto' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Preço do produto' })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ description: 'Estoque do produto' })
  @IsOptional()
  @IsNumber()
  stock?: number;
}
