import { EntityValidationError } from '@/shared/domain/errors/validation-error';
import { CartEntity, CartProps } from '../../cart.entity';

describe('CartEntity integration tests', () => {
  describe('Constructor method', () => {
    it('Should throw an error when creatting a user with invalid user_id', () => {
      let props: CartProps = {
        user_id: null,
      };
      expect(() => new CartEntity(props)).toThrowError(EntityValidationError);

      props = {
        user_id: '',
      };
      expect(() => new CartEntity(props)).toThrowError(EntityValidationError);

      props = {
        user_id: 10 as any,
      };
      expect(() => new CartEntity(props)).toThrowError(EntityValidationError);

      props = {
        user_id: 'a'.repeat(256),
      };
      expect(() => new CartEntity(props)).toThrowError(EntityValidationError);
    });

    it('Should valid a user_id', () => {
      expect.assertions(1);
      let props: CartProps = {
        user_id: '254343eb-5e33-4e62-b817-9dd624dffc96',
      };
      expect(() => new CartEntity(props)).not.toThrowError(
        EntityValidationError,
      );
    });
  });
});
