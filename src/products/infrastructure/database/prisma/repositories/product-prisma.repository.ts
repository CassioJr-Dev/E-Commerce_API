import { ProductEntity } from '@/products/domain/entities/product.entity';
import { ProductRepository } from '@/products/domain/repositories/product.repository';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { ProductModelMapper } from '../models/product-model.mapper';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { ForbiddenError } from '@/shared/domain/errors/forbidden-error';

export class ProductPrismaRepository implements ProductRepository.Repository {
  sortableFields: string[] = ['name', 'price', 'created_at'];

  constructor(private prismaService: PrismaService) {}

  async search(
    props: ProductRepository.SearchParams,
  ): Promise<ProductRepository.SearchResult> {
    const sortable = this.sortableFields?.includes(props.sort) || false;
    const orderByField = sortable ? props.sort : 'created_at';
    const orderByDir = sortable ? props.sortDir : 'desc';

    const count = await this.prismaService.product.count({
      ...(props.filter && {
        where: {
          name: {
            contains: props.filter,
            mode: 'insensitive',
          },
        },
      }),
    });

    const models = await this.prismaService.product.findMany({
      ...(props.filter && {
        where: {
          name: {
            contains: props.filter,
            mode: 'insensitive',
          },
        },
      }),
      orderBy: {
        [orderByField]: orderByDir,
      },
      skip: props.page && props.page > 0 ? (props.page - 1) * props.perPage : 1,
      take: props.perPage && props.perPage > 0 ? props.perPage : 15,
    });

    return new ProductRepository.SearchResult({
      items: models.map(model => ProductModelMapper.toEntity(model)),
      total: count,
      currentPage: props.page,
      perPage: props.perPage,
      sort: orderByField,
      sortDir: orderByDir,
      filter: props.filter,
    });
  }

  async insert(entity: ProductEntity): Promise<void> {
    await this.userIsSeller(entity.user_id);
    await this.prismaService.product.create({
      data: entity.toJSON(),
    });
  }

  async findById(id: string): Promise<ProductEntity> {
    return this._get(id);
  }

  async findAll(user_id: string): Promise<ProductEntity[]> {
    const models = await this.prismaService.product.findMany({
      where: {
        user_id,
      },
    });
    return models.map(model => ProductModelMapper.toEntity(model));
  }

  async update(entity: ProductEntity): Promise<void> {
    await this._get(entity.id, entity.user_id);

    await this.prismaService.product.update({
      data: entity.toJSON(),
      where: {
        id: entity.id,
      },
    });
  }

  async delete(id: string, user_id: string): Promise<void> {
    await this._get(id, user_id);
    await this.prismaService.product.delete({
      where: { id },
    });
  }

  protected async _get(id: string, user_id?: string): Promise<ProductEntity> {
    const whereClause = { id };

    if (user_id) {
      await this.userIsSeller(user_id);
      whereClause['user_id'] = user_id;
    }

    try {
      const product = await this.prismaService.product.findUnique({
        where: whereClause,
      });
      return ProductModelMapper.toEntity(product);
    } catch {
      throw new NotFoundError('ProductModel not found');
    }
  }

  protected async userIsSeller(user_id: string): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      new NotFoundError(`UserModel not found using ID ${user_id}`);
    }

    if (user.isSeller === false) {
      throw new ForbiddenError(
        'You do not have permission to perform this action',
      );
    }

    return true;
  }
}
