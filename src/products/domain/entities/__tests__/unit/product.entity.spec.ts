import { ProductDataBuilder } from '@/products/domain/testing/helpers/product-data-builder';
import { ProductEntity, ProductProps } from '../../product.entity';

describe('ProductEntity unit tests', () => {
  let props: ProductProps;
  let sut: ProductEntity;

  beforeEach(() => {
    props = ProductDataBuilder({});
    sut = new ProductEntity(props);
  });

  it('Constructor method test', () => {
    expect(sut.props.name).toEqual(props.name);
    expect(sut.props.description).toEqual(props.description);
    expect(sut.props.price).toEqual(props.price);
    expect(sut.props.user_id).toEqual(props.user_id);

    console.log(sut);
  });

  it('Getter of name field', () => {
    expect(sut.name).toBeDefined();
    expect(sut.name).toEqual(props.name);
    expect(typeof sut.name).toBe('string');
  });

  it('Setter of name field', () => {
    sut['name'] = 'Phone';
    expect(sut.name).toEqual('Phone');
    expect(typeof sut.name).toBe('string');
  });

  it('Getter of description field', () => {
    expect(sut.description).toBeDefined();
    expect(sut.description).toEqual(props.description);
    expect(typeof sut.description).toBe('string');
  });

  it('Setter of description field', () => {
    sut['description'] = 'new description';
    expect(sut.description).toEqual('new description');
    expect(typeof sut.description).toBe('string');
  });

  it('Getter of price field', () => {
    expect(sut.price).toBeDefined();
    expect(sut.price).toEqual(props.price);
    expect(typeof sut.price).toBe('number');
  });

  it('Setter of price field', () => {
    sut['price'] = 10.0;
    expect(sut.price).toEqual(10.0);
    expect(typeof sut.price).toBe('number');
  });

  it('Getter of stock field', () => {
    expect(sut.stock).toBeDefined();
    expect(sut.stock).toEqual(props.stock);
    expect(typeof sut.stock).toBe('number');
  });

  it('Setter of stock field', () => {
    sut['stock'] = 5;
    expect(sut.stock).toEqual(5);
    expect(typeof sut.stock).toBe('number');
  });

  it('Getter of user_id field', () => {
    expect(sut.user_id).toBeDefined();
    expect(sut.user_id).toEqual(props.user_id);
    expect(typeof sut.user_id).toBe('string');
  });

  it('Setter of user_id field', () => {
    sut['user_id'] = '732ba981-2692-47d1-8132-3604e34212a8';
    expect(sut.user_id).toEqual('732ba981-2692-47d1-8132-3604e34212a8');
    expect(typeof sut.user_id).toBe('string');
  });

  it('Should update the name field', () => {
    const toDateSpy = jest.spyOn(sut, 'toDate');
    sut.updateName('other product name');

    expect(toDateSpy).toHaveBeenCalledTimes(1);
    expect(sut.name).toEqual('other product name');
  });

  it('Should update the description field', () => {
    const toDateSpy = jest.spyOn(sut, 'toDate');
    sut.updateDescription('other product description');

    expect(toDateSpy).toHaveBeenCalledTimes(1);
    expect(sut.description).toEqual('other product description');
  });

  it('Should update the price field', () => {
    const toDateSpy = jest.spyOn(sut, 'toDate');
    sut.updatePrice(20.0);

    expect(toDateSpy).toHaveBeenCalledTimes(1);
    expect(sut.price).toEqual(20.0);
  });
});
