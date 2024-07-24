import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { AddItemUseCase } from '../../application/usecases/addItem.usecase';

export class AddItemToCartDto implements Omit<AddItemUseCase.Input, 'user_id'> {
  @IsString()
  @IsNotEmpty()
  cart_id: string;

  @IsString()
  @IsNotEmpty()
  product_id: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
