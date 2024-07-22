import { IsNumber, IsString } from 'class-validator';
import { UpdateQuantityUseCase } from '../../application/usecases/updateQuantity.usecase';

export class UpdateCartItemDto
  implements Omit<UpdateQuantityUseCase.Input, 'user_id' | 'cart_id'>
{
  @IsString()
  item_id: string;

  @IsNumber()
  quantity: number;
}
