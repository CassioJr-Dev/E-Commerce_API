import { CartItemEntity, CartItemProps } from '../../cartItem.entity';

describe('CartItemEntity unit tests', () => {
  let props: CartItemProps;
  let sut: CartItemEntity;

  beforeEach(() => {
    props = {
      cart_id: 'f0e0eabc-5821-43d0-bf5d-b9d8e4f4be8f',
      product_id: '1e4b9f2b-6a98-4f02-b42f-14c1c4b1c43a',
      quantity: 5,
    };

    sut = new CartItemEntity(props);
  });

  it('Constructor method test', () => {
    new CartItemEntity(props);
    expect(sut.props.cart_id).toEqual(props.cart_id);
    expect(sut.props.product_id).toEqual(props.product_id);
    expect(sut.props.quantity).toEqual(props.quantity);
  });

  it('Getter of cart_id field', () => {
    expect(sut.cart_id).toBeDefined();
    expect(sut.cart_id).toEqual(props.cart_id);
    expect(typeof sut.cart_id).toBe('string');
  });

  it('Setter of cart_id field', () => {
    sut['cart_id'] = 'fakeId';
    expect(sut.props.cart_id).toEqual('fakeId');
    expect(typeof sut.props.cart_id).toBe('string');
  });

  it('Getter of product_id field', () => {
    expect(sut.product_id).toBeDefined();
    expect(sut.product_id).toEqual(props.product_id);
    expect(typeof sut.product_id).toBe('string');
  });

  it('Setter of product_id field', () => {
    sut['product_id'] = 'fakeId';
    expect(sut.props.product_id).toEqual('fakeId');
    expect(typeof sut.props.product_id).toBe('string');
  });

  it('Getter of quantity field', () => {
    expect(sut.quantity).toBeDefined();
    expect(sut.quantity).toEqual(props.quantity);
    expect(typeof sut.quantity).toBe('number');
  });

  it('Setter of quantity field', () => {
    sut['quantity'] = 5;
    expect(sut.props.quantity).toEqual(5);
    expect(typeof sut.props.quantity).toBe('number');
  });

  it('Should update the quantity field', () => {
    const toDateSpy = jest.spyOn(sut, 'toDate');
    sut.updateQuantity(10);

    expect(toDateSpy).toHaveBeenCalledTimes(1);
    expect(sut.quantity).toEqual(10);
  });
});
