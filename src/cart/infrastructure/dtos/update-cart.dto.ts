import { IsNumber, IsString } from 'class-validator';
import { UpdateQuantityUseCase } from '../../application/usecases/updateQuantity.usecase';

export class UpdateCartDto
  implements Omit<UpdateQuantityUseCase.Input, 'user_id'>
{
  @IsString()
  cart_id: string;

  @IsString()
  item_id: string;

  @IsNumber()
  quantity: number;
}
