import { instanceToPlain } from 'class-transformer';
import {
  CartItemCollectionPresenter,
  CartItemPresenter,
} from '../../cartItem.presenter';

describe('CartItemPresenter unit tests', () => {
  const props = {
    id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
    cart_id: '316f9563-eaf2-4563-b367-725a633c7039',
    product_id: 'eeed6fba-4b9f-4fd8-ab53-60cfccc12244',
    quantity: 5,
    created_at: new Date(),
    updated_at: new Date(),
  };

  let sut: CartItemPresenter;

  beforeEach(() => {
    sut = new CartItemPresenter(props);
  });

  describe('constructor', () => {
    it('should set values', () => {
      expect(sut.id).toEqual(props.id);
      expect(sut.cart_id).toEqual(props.cart_id);
      expect(sut.product_id).toEqual(props.product_id);
      expect(sut.quantity).toEqual(props.quantity);
      expect(sut.created_at).toEqual(props.created_at);
      expect(sut.updated_at).toEqual(props.updated_at);
    });

    it('should presenter data', () => {
      const output = instanceToPlain(sut);
      expect(output).toStrictEqual({
        id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
        cart_id: '316f9563-eaf2-4563-b367-725a633c7039',
        product_id: 'eeed6fba-4b9f-4fd8-ab53-60cfccc12244',
        quantity: 5,
        created_at: sut.created_at.toISOString(),
        updated_at: sut.updated_at.toISOString(),
      });
    });
  });

  describe('CartItemCollectionPresenter unit tests', () => {
    const created_at = new Date();
    const updated_at = new Date();
    const props = {
      id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
      cart_id: '316f9563-eaf2-4563-b367-725a633c7039',
      product_id: 'eeed6fba-4b9f-4fd8-ab53-60cfccc12244',
      quantity: 5,
      created_at: new Date(),
      updated_at: new Date(),
    };

    describe('constructor', () => {
      it('should set values', () => {
        const sut = new CartItemCollectionPresenter([
          {
            ...props,
          },
        ]);

        expect(sut.data).toStrictEqual([new CartItemPresenter(props)]);
      });
    });
  });
});
