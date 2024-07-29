import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { AddItemUseCase } from '../../application/usecases/addItem.usecase';
import { ApiProperty } from '@nestjs/swagger';

export class AddItemToCartDto implements Omit<AddItemUseCase.Input, 'user_id'> {
  @ApiProperty({ description: 'Id do carrinho' })
  @IsString()
  @IsNotEmpty()
  cart_id: string;

  @ApiProperty({ description: 'Id do produto' })
  @IsString()
  @IsNotEmpty()
  product_id: string;

  @ApiProperty({ description: 'Quatidade de produtos' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
