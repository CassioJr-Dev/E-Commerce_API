import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import { ProductEntity, ProductProps } from '../../product.entity';
import { EntityValidationError } from '@/shared/domain/errors/validation-error';

describe('ProductEntity integration tests', () => {
  describe('Constructor method', () => {
    it('Should throw an error when creatting a user with invalid name', () => {
      let props: ProductProps = {
        ...ProductDataBuilder({}),
        name: null,
      };
      expect(() => new ProductEntity(props)).toThrowError(
        EntityValidationError,
      );

      props = {
        ...ProductDataBuilder({}),
        name: '',
      };
      expect(() => new ProductEntity(props)).toThrowError(
        EntityValidationError,
      );

      props = {
        ...ProductDataBuilder({}),
        name: 10 as any,
      };
      expect(() => new ProductEntity(props)).toThrowError(
        EntityValidationError,
      );

      props = {
        ...ProductDataBuilder({}),
        name: 'a'.repeat(256),
      };
      expect(() => new ProductEntity(props)).toThrowError(
        EntityValidationError,
      );
    });

    it('Should throw an error when creatting a user with invalid description', () => {
      let props: ProductProps = {
        ...ProductDataBuilder({}),
        description: null,
      };

      props = {
        ...ProductDataBuilder({}),
        description: 'a'.repeat(256),
      };
      expect(() => new ProductEntity(props)).toThrowError(
        EntityValidationError,
      );

      props = {
        ...ProductDataBuilder({}),
        description: 10 as any,
      };
      expect(() => new ProductEntity(props)).toThrowError(
        EntityValidationError,
      );
    });

    it('Should throw an error when creatting a user with invalid price', () => {
      let props: ProductProps = {
        ...ProductDataBuilder({}),
        price: null,
      };
      expect(() => new ProductEntity(props)).toThrowError(
        EntityValidationError,
      );

      props = {
        ...ProductDataBuilder({}),
        price: '10' as any,
      };
      expect(() => new ProductEntity(props)).toThrowError(
        EntityValidationError,
      );
    });

    it('Should throw an error when creatting a user with invalid stock', () => {
      let props: ProductProps = {
        ...ProductDataBuilder({}),
        stock: null,
      };
      expect(() => new ProductEntity(props)).toThrowError(
        EntityValidationError,
      );

      props = {
        ...ProductDataBuilder({}),
        stock: '10' as any,
      };
      expect(() => new ProductEntity(props)).toThrowError(
        EntityValidationError,
      );
    });

    it('Should throw an error when creatting a user with invalid user_id', () => {
      let props: ProductProps = {
        ...ProductDataBuilder({}),
        user_id: null,
      };
      expect(() => new ProductEntity(props)).toThrowError(
        EntityValidationError,
      );

      props = {
        ...ProductDataBuilder({}),
        user_id: 10 as any,
      };
      expect(() => new ProductEntity(props)).toThrowError(
        EntityValidationError,
      );
    });

    it('Should valid a product', () => {
      expect.assertions(1);
      let props: ProductProps = {
        ...ProductDataBuilder({}),
      };
      expect(() => new ProductEntity(props)).not.toThrowError(
        EntityValidationError,
      );
    });
  });

  describe('UpdateName method', () => {
    let props: ProductProps;
    let sut: ProductEntity;
    let argument: any;
    beforeEach(() => {
      props = ProductDataBuilder({});
      sut = new ProductEntity(props);
    });
    it('Should throw an error when update a user with invalid name', () => {
      argument = null;
      expect(() => sut.updateName(argument)).toThrowError(
        EntityValidationError,
      );

      argument = '';
      expect(() => sut.updateName(argument)).toThrowError(
        EntityValidationError,
      );

      argument = 10;
      expect(() => sut.updateName(argument)).toThrowError(
        EntityValidationError,
      );

      argument = 'a'.repeat(256);
      expect(() => sut.updateName(argument)).toThrowError(
        EntityValidationError,
      );
    });

    it('Should valid user updateName', () => {
      expect.assertions(1);
      argument = ProductDataBuilder({}).name;
      expect(() => sut.updateName(argument)).not.toThrowError(
        EntityValidationError,
      );
    });
  });

  describe('UpdateDescription method', () => {
    let props: ProductProps;
    let sut: ProductEntity;
    let argument: any;
    beforeEach(() => {
      props = ProductDataBuilder({});
      sut = new ProductEntity(props);
    });
    it('Should throw an error when update a user with invalid description', () => {
      argument = 'a'.repeat(256);
      expect(() => sut.updateDescription(argument)).toThrowError(
        EntityValidationError,
      );

      argument = 10;
      expect(() => sut.updateDescription(argument)).toThrowError(
        EntityValidationError,
      );
    });

    it('Should valid user updateDescription', () => {
      expect.assertions(1);
      argument = ProductDataBuilder({}).description;
      expect(() => sut.updateDescription(argument)).not.toThrowError(
        EntityValidationError,
      );
    });
  });

  describe('UpdatePrice method', () => {
    let props: ProductProps;
    let sut: ProductEntity;
    let argument: any;
    beforeEach(() => {
      props = ProductDataBuilder({});
      sut = new ProductEntity(props);
    });
    it('Should throw an error when update a user with invalid price', () => {
      argument = null;
      expect(() => sut.updatePrice(argument)).toThrowError(
        EntityValidationError,
      );

      argument = 'a';
      expect(() => sut.updatePrice(argument)).toThrowError(
        EntityValidationError,
      );
    });

    it('Should valid user updatePrice', () => {
      expect.assertions(1);
      argument = ProductDataBuilder({}).price;
      expect(() => sut.updatePrice(argument)).not.toThrowError(
        EntityValidationError,
      );
    });
  });

  describe('UpdateStock method', () => {
    let props: ProductProps;
    let sut: ProductEntity;
    let argument: any;
    beforeEach(() => {
      props = ProductDataBuilder({});
      sut = new ProductEntity(props);
    });
    it('Should throw an error when update a user with invalid stock', () => {
      argument = null;
      expect(() => sut.updateStock(argument)).toThrowError(
        EntityValidationError,
      );

      argument = 'a';
      expect(() => sut.updateStock(argument)).toThrowError(
        EntityValidationError,
      );
    });

    it('Should valid user updateStock', () => {
      expect.assertions(1);
      argument = ProductDataBuilder({}).stock;
      expect(() => sut.updateStock(argument)).not.toThrowError(
        EntityValidationError,
      );
    });
  });
});
