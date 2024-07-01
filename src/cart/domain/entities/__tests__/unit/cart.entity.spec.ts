import { CartEntity, CartProps } from '../../cart.entity';

describe('CartEntity unit tests', () => {
  let props: CartProps;
  let sut: CartEntity;

  beforeEach(() => {
    props = {
      user_id: 'f0e0eabc-5821-43d0-bf5d-b9d8e4f4be8f',
    };

    sut = new CartEntity(props);
  });

  it('Constructor method test', () => {
    new CartEntity(props);
    expect(sut.props.user_id).toEqual(props.user_id);
  });

  it('Getter of cart_id field', () => {
    expect(sut.user_id).toBeDefined();
    expect(sut.user_id).toEqual(props.user_id);
    expect(typeof sut.user_id).toBe('string');
  });

  it('Setter of user_id field', () => {
    sut['user_id'] = 'fakeId';
    expect(sut.props.user_id).toEqual('fakeId');
    expect(typeof sut.props.user_id).toBe('string');
  });

  it('Should update the updated_at field', () => {
    const toDateSpy = jest.spyOn(sut, 'toDate');
    sut.updateDate();
    expect(toDateSpy).toHaveBeenCalledTimes(1);
  });
});
