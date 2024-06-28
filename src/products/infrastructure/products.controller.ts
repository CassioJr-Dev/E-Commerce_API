import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateProductUseCase } from '../application/usecases/create-product.usecase';
import { GetProductUseCase } from '../application/usecases/get-product.usecase';
import { ListProductsUseCase } from '../application/usecases/list-products.usecase';
import { UpdateProductUseCase } from '../application/usecases/update-product.usecase';
import { DeleteProductUseCase } from '../application/usecases/delete-product.usecase';
import { AuthService } from '@/auth/infrastructure/auth.service';
import { ProductOutput } from '../application/dtos/product-output';
import {
  ProductCollectionPresenter,
  ProductPresenter,
} from './presenters/product.presenter';
import { CreateProductDto } from './dtos/create-product.dto';
import { AuthGuard } from '@/auth/infrastructure/auth.guard';
import { ListProductsDto } from './dtos/list-products.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ApiBearerAuth, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  @Inject(CreateProductUseCase.UseCase)
  private createProductUseCase: CreateProductUseCase.UseCase;

  @Inject(GetProductUseCase.UseCase)
  private getProductUseCase: GetProductUseCase.UseCase;

  @Inject(ListProductsUseCase.UseCase)
  private listProductsUseCase: ListProductsUseCase.UseCase;

  @Inject(UpdateProductUseCase.UseCase)
  private updateProductUseCase: UpdateProductUseCase.UseCase;

  @Inject(DeleteProductUseCase.UseCase)
  private deleteProductUseCase: DeleteProductUseCase.UseCase;

  @Inject(AuthService)
  private authService: AuthService;

  static productToResponse(output: ProductOutput) {
    return new ProductPresenter(output);
  }

  static listProductsToResponse(output: ListProductsUseCase.Output) {
    return new ProductCollectionPresenter(output);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            isSeller: { type: 'boolean' },
            email: { type: 'string', format: 'email' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Usuário não é vendedor',
  })
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createpDto: CreateProductDto,
    @Headers('Authorization') authorization: string,
  ) {
    const extractUserId = await this.authService.extractPayload(authorization);
    const output = await this.createProductUseCase.execute({
      ...createpDto,
      user_id: extractUserId,
    });
    return ProductsController.productToResponse(output);
  }

  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        meta: {
          type: 'object',
          properties: {
            total: {
              type: 'number',
            },
            currentPage: {
              type: 'number',
            },
            lastPage: {
              type: 'number',
            },
            perPage: {
              type: 'number',
            },
          },
        },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(ProductPresenter) },
        },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Parâmetros de consulta inválidos',
  })
  @Get()
  async search(@Query() searchParams: ListProductsDto) {
    const ouput = await this.listProductsUseCase.execute(searchParams);
    return ProductsController.listProductsToResponse(ouput);
  }

  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            price: { type: 'number' },
            stock: { type: 'number' },
            user_id: { type: 'string', format: 'uuid' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Id não encontrado',
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.getProductUseCase.execute({ id });
    return ProductsController.productToResponse(output);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            price: { type: 'number' },
            stock: { type: 'number' },
            user_id: { type: 'string', format: 'uuid' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Corpo da requisição com dados inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Id não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
  })
  @UseGuards(AuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Headers('Authorization') authorization: string,
  ) {
    const extractUserId = await this.authService.extractPayload(authorization);
    const output = await this.updateProductUseCase.execute({
      id,
      ...updateProductDto,
      user_id: extractUserId,
    });
    return ProductsController.productToResponse(output);
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 204,
    description: 'Resposta de confirmação da exclusão',
  })
  @ApiResponse({
    status: 404,
    description: 'Id não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
  })
  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('Authorization') authorization: string,
  ) {
    const extractUserId = await this.authService.extractPayload(authorization);
    await this.deleteProductUseCase.execute({
      id,
      user_id: extractUserId,
    });
  }
}
