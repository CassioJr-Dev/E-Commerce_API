import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { CartItemEntity, CartItemProps } from '../../cartItem.entity';

describe('CartItemEntity integration tests', () => {
  let props: CartItemProps;

  beforeEach(() => {
    props = {
      cart_id: '254343eb-5e33-4e62-b817-9dd624dffc96',
      product_id: '5064f9ec-962f-49be-985f-8020e2d1522e',
      quantity: 5,
    };
  });
  describe('Constructor method', () => {
    it('Should throw an error when creatting a user with invalid cart_id', () => {
      props = {
        ...props,
        cart_id: null,
      };
      expect(() => new CartItemEntity(props)).toThrowError(
        EntityValidationError,
      );

      props = {
        ...props,
        cart_id: '',
      };
      expect(() => new CartItemEntity(props)).toThrowError(
        EntityValidationError,
      );

      props = {
        ...props,
        cart_id: 10 as any,
      };
      expect(() => new CartItemEntity(props)).toThrowError(
        EntityValidationError,
      );

      props = {
        ...props,
        cart_id: 'a'.repeat(256),
      };
      expect(() => new CartItemEntity(props)).toThrowError(
        EntityValidationError,
      );
    });

    it('Should throw an error when creatting a user with invalid product_id', () => {
      props = {
        ...props,
        product_id: null,
      };
      expect(() => new CartItemEntity(props)).toThrowError(
        EntityValidationError,
      );

      props = {
        ...props,
        product_id: '',
      };
      expect(() => new CartItemEntity(props)).toThrowError(
        EntityValidationError,
      );

      props = {
        ...props,
        product_id: 10 as any,
      };
      expect(() => new CartItemEntity(props)).toThrowError(
        EntityValidationError,
      );

      props = {
        ...props,
        product_id: 'a'.repeat(256),
      };
      expect(() => new CartItemEntity(props)).toThrowError(
        EntityValidationError,
      );
    });

    it('Should throw an error when creatting a user with invalid quantity', () => {
      props = {
        ...props,
        quantity: null,
      };
      expect(() => new CartItemEntity(props)).toThrowError(
        EntityValidationError,
      );

      props = {
        ...props,
        quantity: '' as any,
      };
      expect(() => new CartItemEntity(props)).toThrowError(
        EntityValidationError,
      );
    });

    it('Should valid a CartItem', () => {
      expect.assertions(1);

      expect(() => new CartItemEntity(props)).not.toThrowError(
        EntityValidationError,
      );
    });
  });

  describe('updateQuantity method', () => {
    let props: CartItemProps;
    let sut: CartItemEntity;
    let argument: any;
    beforeEach(() => {
      props = {
        cart_id: '254343eb-5e33-4e62-b817-9dd624dffc96',
        product_id: '5064f9ec-962f-49be-985f-8020e2d1522e',
        quantity: 5,
      };
      sut = new CartItemEntity(props);
    });
    it('Should throw an error when update a cartItem with invalid quantity', () => {
      argument = null;
      expect(() => sut.updateQuantity(argument)).toThrowError(
        EntityValidationError,
      );

      argument = '';
      expect(() => sut.updateQuantity(argument)).toThrowError(
        EntityValidationError,
      );

      argument = 'a'.repeat(256);
      expect(() => sut.updateQuantity(argument)).toThrowError(
        EntityValidationError,
      );
    });

    it('Should valid cartItem updateQuantity', () => {
      expect.assertions(1);
      argument = 10;
      expect(() => sut.updateQuantity(argument)).not.toThrowError(
        EntityValidationError,
      );
    });
  });
});
