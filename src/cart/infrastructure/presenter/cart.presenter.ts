import { CartOutput } from '@/cart/application/dtos/cart-output';
import { Transform } from 'class-transformer';

export class CartPresenter {
  id: string;
  user_id: string;
  @Transform(({ value }: { value: Date }) => value.toISOString())
  created_at: Date;
  @Transform(({ value }: { value: Date }) => value.toISOString())
  updated_at: Date;

  constructor(output: CartOutput) {
    this.id = output.id;
    this.user_id = output.user_id;
    this.created_at = output.created_at;
    this.updated_at = output.updated_at;
  }
}
