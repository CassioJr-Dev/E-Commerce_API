import { instanceToPlain } from 'class-transformer';
import { PaginationPresenter } from '@/shared/infrastructure/presenters/pagination.presenter';
import {
  ProductCollectionPresenter,
  ProductPresenter,
} from '../../product.presenter';

describe('ProductPresenter unit tests', () => {
  const props = {
    id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
    name: 'test name',
    description: 'description of product',
    price: 39.99,
    stock: 10,
    user_id: '550e8400-e29b-41d4-a716-446655440000',
    created_at: new Date(),
    updated_at: new Date(),
  };

  let sut: ProductPresenter;

  beforeEach(() => {
    sut = new ProductPresenter(props);
  });

  describe('constructor', () => {
    it('should set values', () => {
      expect(sut.id).toEqual(props.id);
      expect(sut.name).toEqual(props.name);
      expect(sut.description).toEqual(props.description);
      expect(sut.price).toEqual(props.price);
      expect(sut.stock).toEqual(props.stock);
      expect(sut.user_id).toEqual(props.user_id);
      expect(sut.created_at).toEqual(props.created_at);
      expect(sut.updated_at).toEqual(props.updated_at);
    });

    it('should presenter data', () => {
      const output = instanceToPlain(sut);
      expect(output).toStrictEqual({
        id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
        name: 'test name',
        description: 'description of product',
        price: 39.99,
        stock: 10,
        user_id: '550e8400-e29b-41d4-a716-446655440000',
        created_at: sut.created_at.toISOString(),
        updated_at: sut.updated_at.toISOString(),
      });
    });
  });

  describe('UserCollectionPresenter unit tests', () => {
    const created_at = new Date();
    const updated_at = new Date();
    const props = {
      id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
      name: 'test name',
      description: 'description of product',
      price: 39.99,
      stock: 10,
      user_id: '550e8400-e29b-41d4-a716-446655440000',
      created_at,
      updated_at,
    };

    describe('constructor', () => {
      it('should set values', () => {
        const sut = new ProductCollectionPresenter({
          items: [props],
          currentPage: 1,
          perPage: 2,
          lastPage: 1,
          total: 1,
        });
        expect(sut.meta).toBeInstanceOf(PaginationPresenter);
        expect(sut.meta).toStrictEqual(
          new PaginationPresenter({
            currentPage: 1,
            perPage: 2,
            lastPage: 1,
            total: 1,
          }),
        );
        expect(sut.data).toStrictEqual([new ProductPresenter(props)]);
      });
    });

    it('should presenter data', () => {
      let sut = new ProductCollectionPresenter({
        items: [props],
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      });
      let output = instanceToPlain(sut);
      expect(output).toStrictEqual({
        data: [
          {
            id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
            name: 'test name',
            description: 'description of product',
            price: 39.99,
            stock: 10,
            user_id: '550e8400-e29b-41d4-a716-446655440000',
            created_at: created_at.toISOString(),
            updated_at: updated_at.toISOString(),
          },
        ],
        meta: {
          currentPage: 1,
          perPage: 2,
          lastPage: 1,
          total: 1,
        },
      });

      sut = new ProductCollectionPresenter({
        items: [props],
        currentPage: '1' as any,
        perPage: '2' as any,
        lastPage: '1' as any,
        total: '1' as any,
      });
      output = instanceToPlain(sut);
      expect(output).toStrictEqual({
        data: [
          {
            id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
            name: 'test name',
            description: 'description of product',
            price: 39.99,
            stock: 10,
            user_id: '550e8400-e29b-41d4-a716-446655440000',
            created_at: created_at.toISOString(),
            updated_at: updated_at.toISOString(),
          },
        ],
        meta: {
          currentPage: 1,
          perPage: 2,
          lastPage: 1,
          total: 1,
        },
      });
    });
  });
});
