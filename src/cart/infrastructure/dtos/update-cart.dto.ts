import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UpdateQuantityUseCase } from '../../application/usecases/updateQuantity.usecase';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartItemDto
  implements Omit<UpdateQuantityUseCase.Input, 'user_id' | 'cart_id'>
{
  @ApiProperty({ description: 'Id do item' })
  @IsString()
  @IsNotEmpty()
  item_id: string;

  @ApiProperty({ description: 'Quatidade de produtos' })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
