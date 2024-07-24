import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { UpdateQuantityUseCase } from '../../application/usecases/updateQuantity.usecase';

export class UpdateCartItemDto
  implements Omit<UpdateQuantityUseCase.Input, 'user_id' | 'cart_id'>
{
  @IsString()
  @IsNotEmpty()
  item_id: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
