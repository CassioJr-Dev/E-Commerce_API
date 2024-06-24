import { ListProductsUseCase } from '@/products/application/usecases/list-products.usecase';
import { SortDirection } from '@/shared/domain/repositories/searchable-repository-contracts';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ListProductsDto implements ListProductsUseCase.Input {
  @ApiPropertyOptional({ description: 'Página que será retornada' })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Quantidade de registros por página' })
  @IsOptional()
  perPage?: number;

  @ApiPropertyOptional({
    description:
      'Coluna definida para ordenar os dados: "name", "created_at" ou "price"',
  })
  @IsOptional()
  sort?: string;

  @ApiPropertyOptional({
    description: 'Ordenação dos dados: crescente ou decrescente',
  })
  @IsOptional()
  sortDir?: SortDirection;

  @ApiPropertyOptional({
    description: 'Dado informado para filtrar o resultado',
  })
  @IsOptional()
  filter?: string;
}
