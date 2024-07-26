import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Headers,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { AddItemToCartDto } from './dtos/addItem-cart.dto';
import { UpdateCartItemDto } from './dtos/update-cart.dto';
import { AddItemUseCase } from '../application/usecases/addItem.usecase';
import { AuthService } from '@/auth/infrastructure/auth.service';
import { CreateCartUseCase } from '../application/usecases/createCart.usecase';
import { DeleteCartUseCase } from '../application/usecases/deleteCart.usecase';
import { DeleteItemUseCase } from '../application/usecases/deleteItem.usecase';
import { GetCartUseCase } from '../application/usecases/getCart.usecase';
import { GetItemsCartUseCase } from '../application/usecases/getItems.usecase';
import { UpdateQuantityUseCase } from '../application/usecases/updateQuantity.usecase';
import {
  CartItemCollectionPresenter,
  CartItemPresenter,
} from './presenter/cartItem.presenter';
import { CartItemOutput } from '../application/dtos/cartItem-output';
import { CartOutput } from '../application/dtos/cart-output';
import { CartPresenter } from './presenter/cart.presenter';
import { AuthGuard } from '@/auth/infrastructure/auth.guard';

@Controller('cart')
export class CartController {
  @Inject(CreateCartUseCase.UseCase)
  private createCartUseCase: CreateCartUseCase.UseCase;

  @Inject(AddItemUseCase.UseCase)
  private addItemUseCase: AddItemUseCase.UseCase;

  @Inject(GetCartUseCase.UseCase)
  private getCartUseCase: GetCartUseCase.UseCase;

  @Inject(GetItemsCartUseCase.UseCase)
  private getItemsCartUseCase: GetItemsCartUseCase.UseCase;

  @Inject(UpdateQuantityUseCase.UseCase)
  private updateQuantityUseCase: UpdateQuantityUseCase.UseCase;

  @Inject(DeleteCartUseCase.UseCase)
  private deleteCartUseCase: DeleteCartUseCase.UseCase;

  @Inject(DeleteItemUseCase.UseCase)
  private deleteItemUseCase: DeleteItemUseCase.UseCase;

  @Inject(AuthService)
  private authService: AuthService;

  static cartItemToResponse(output: CartItemOutput) {
    return new CartItemPresenter(output);
  }

  static listCartItemsToResponse(output: GetItemsCartUseCase.Output) {
    return new CartItemCollectionPresenter(output);
  }

  static cartToResponse(output: CartOutput) {
    return new CartPresenter(output);
  }

  @UseGuards(AuthGuard)
  @Post('createCart')
  async createCart(@Headers('Authorization') authorization: string) {
    const extractUserId = await this.authService.extractPayload(authorization);
    const createCart = await this.createCartUseCase.execute({
      user_id: extractUserId,
    });
    return CartController.cartToResponse(createCart);
  }

  @UseGuards(AuthGuard)
  @Post()
  async addItem(
    @Body() createCartDto: AddItemToCartDto,
    @Headers('Authorization') authorization: string,
  ) {
    const extractUserId = await this.authService.extractPayload(authorization);
    const insertItem = await this.addItemUseCase.execute({
      ...createCartDto,
      user_id: extractUserId,
    });

    return CartController.cartItemToResponse(insertItem);
  }

  @UseGuards(AuthGuard)
  @Get('items/:id')
  async findAll(
    @Param('id') cart_id: string,
    @Headers('Authorization') authorization: string,
  ) {
    const extractUserId = await this.authService.extractPayload(authorization);
    const findItems = await this.getItemsCartUseCase.execute({
      cart_id,
      user_id: extractUserId,
    });

    return CartController.listCartItemsToResponse(findItems);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findCart(
    @Param('id') cart_id: string,
    @Headers('Authorization') authorization: string,
  ) {
    const extractUserId = await this.authService.extractPayload(authorization);
    const findCart = await this.getCartUseCase.execute({
      cart_id,
      user_id: extractUserId,
    });

    return CartController.cartToResponse(findCart);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateQuantity(
    @Param('id') cart_id: string,
    @Body() updateCartDto: UpdateCartItemDto,
    @Headers('Authorization') authorization: string,
  ) {
    const extractUserId = await this.authService.extractPayload(authorization);
    const update = await this.updateQuantityUseCase.execute({
      ...updateCartDto,
      cart_id,
      user_id: extractUserId,
    });

    return CartController.cartItemToResponse(update);
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async removeCart(
    @Param('id') cart_id: string,
    @Headers('Authorization') authorization: string,
  ) {
    const extractUserId = await this.authService.extractPayload(authorization);
    await this.deleteCartUseCase.execute({ cart_id, user_id: extractUserId });
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete(':id/item/:itemId')
  async removeItem(
    @Param('itemId') item_id: string,
    @Param('id') cart_id: string,
    @Headers('Authorization') authorization: string,
  ) {
    const extractUserId = await this.authService.extractPayload(authorization);
    await this.deleteItemUseCase.execute({
      cart_id,
      item_id,
      user_id: extractUserId,
    });
  }
}
