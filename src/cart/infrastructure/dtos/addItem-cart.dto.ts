import { IsNumber, IsString } from 'class-validator';
import { AddItemUseCase } from '../../application/usecases/addItem.usecase';

export class CreateCartDto implements Omit<AddItemUseCase.Input, 'user_id'> {
  @IsString()
  cart_id: string;

  @IsString()
  product_id: string;

  @IsNumber()
  quantity: number;
}
