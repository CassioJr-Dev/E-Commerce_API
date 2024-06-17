import { ProductProps } from '@/products/domain/entities/product.entity';
import {
  ProductRules,
  ProductValidator,
  ProductValidatorFactory,
} from '../../product-validator';
import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';

describe('ProductValidator unit tests', () => {
  let sut: ProductValidator;
  let props: ProductProps;

  beforeEach(() => {
    sut = ProductValidatorFactory.create();
    props = ProductDataBuilder({});
  });

  it('Invalidation cases for name field', () => {
    let isValid = sut.validate(null);
    expect(isValid).toBeFalsy();
    expect(sut.errors['name']).toStrictEqual([
      'name should not be empty',
      'name must be a string',
      'name must be shorter than or equal to 255 characters',
    ]);

    isValid = sut.validate({ ...props, name: '' });
    expect(isValid).toBeFalsy();
    expect(sut.errors['name']).toStrictEqual(['name should not be empty']);

    isValid = sut.validate({ ...props, name: 10 as any });
    expect(isValid).toBeFalsy();
    expect(sut.errors['name']).toStrictEqual([
      'name must be a string',
      'name must be shorter than or equal to 255 characters',
    ]);
  });

  it('Invalidation cases for description field', () => {
    let isValid = sut.validate({ ...props, description: 'a'.repeat(1001) });
    expect(isValid).toBeFalsy();
    expect(sut.errors['description']).toStrictEqual([
      'description must be shorter than or equal to 1000 characters',
    ]);

    isValid = sut.validate({ ...props, description: 10 as any });
    expect(isValid).toBeFalsy();
    expect(sut.errors['description']).toStrictEqual([
      'description must be a string',
      'description must be shorter than or equal to 1000 characters',
    ]);
  });

  it('Invalidation cases for price field', () => {
    let isValid = sut.validate(null);
    expect(isValid).toBeFalsy();
    expect(sut.errors['price']).toStrictEqual([
      'price should not be empty',
      'price must be a number conforming to the specified constraints',
    ]);

    isValid = sut.validate({ ...props, price: '10' as any });
    expect(isValid).toBeFalsy();
    expect(sut.errors['price']).toStrictEqual([
      'price must be a number conforming to the specified constraints',
    ]);
  });

  it('Invalidation cases for stock field', () => {
    let isValid = sut.validate(null);
    expect(isValid).toBeFalsy();
    expect(sut.errors['stock']).toStrictEqual([
      'stock should not be empty',
      'stock must be a number conforming to the specified constraints',
    ]);

    isValid = sut.validate({ ...props, stock: '10' as any });
    expect(isValid).toBeFalsy();
    expect(sut.errors['stock']).toStrictEqual([
      'stock must be a number conforming to the specified constraints',
    ]);
  });

  it('Invalidation cases for user_id field', () => {
    let isValid = sut.validate(null);
    expect(isValid).toBeFalsy();
    expect(sut.errors['user_id']).toStrictEqual([
      'user_id should not be empty',
      'user_id must be a string',
    ]);

    isValid = sut.validate({ ...props, user_id: '' });
    expect(isValid).toBeFalsy();
    expect(sut.errors['user_id']).toStrictEqual([
      'user_id should not be empty',
    ]);

    isValid = sut.validate({ ...props, user_id: 10 as any });
    expect(isValid).toBeFalsy();
    expect(sut.errors['user_id']).toStrictEqual(['user_id must be a string']);
  });

  it('Valid case for user rules', () => {
    let isValid = sut.validate(props);
    expect(isValid).toBeTruthy();
    expect(sut.validatedData).toStrictEqual(new ProductRules(props));
  });
});
