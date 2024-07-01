import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';

@Module({
  controllers: [CartController],
  providers: [],
})
export class CartModule {}
