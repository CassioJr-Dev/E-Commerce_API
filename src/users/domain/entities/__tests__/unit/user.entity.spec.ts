import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserEntity, UserProps } from '../../user.entity';

describe('UserEntity unit tests', () => {
  let props: UserProps;
  let sut: UserEntity;
  beforeEach(() => {
    props = UserDataBuilder({});
    sut = new UserEntity(props);
  });

  it('Constructor method test', () => {
    expect(sut.props.name).toEqual(props.name);
    expect(sut.props.isSeller).toEqual(props.isSeller);
    expect(sut.props.email).toEqual(props.email);
    expect(sut.props.password).toEqual(props.password);
    console.log(props);
  });

  it('Getter of name field', () => {
    expect(sut.name).toBeDefined();
    expect(sut.name).toEqual(props.name);
    expect(typeof sut.name).toBe('string');
  });

  it('Setter of name field', () => {
    sut['name'] = 'bill gates';
    expect(sut.props.name).toEqual('bill gates');
    expect(typeof sut.props.name).toBe('string');
  });

  it('Getter of isSeller field', () => {
    expect(sut.isSeller).toBeDefined();
    expect(sut.isSeller).toEqual(props.isSeller);
    expect(typeof sut.isSeller).toBe('boolean');
  });

  it('Setter of isSeller field', () => {
    sut['isSeller'] = true;
    expect(sut.props.isSeller).toEqual(true);
    expect(typeof sut.props.isSeller).toBe('boolean');
  });

  it('Getter of email field', () => {
    expect(sut.email).toBeDefined();
    expect(sut.email).toEqual(props.email);
    expect(typeof sut.email).toBe('string');
  });

  it('Setter of email field', () => {
    sut['email'] = 'billgates@gmail.com';
    expect(sut.props.email).toEqual('billgates@gmail.com');
    expect(typeof sut.props.email).toBe('string');
  });

  it('Getter of password field', () => {
    expect(sut.password).toBeDefined();
    expect(sut.password).toEqual(props.password);
    expect(typeof sut.password).toBe('string');
  });

  it('Setter of empasswordail field', () => {
    sut['password'] = 'bill345gates';
    expect(sut.props.password).toEqual('bill345gates');
    expect(typeof sut.props.password).toBe('string');
  });
});
