import { instanceToPlain } from 'class-transformer';
import { UserPresenter } from '../../user.presenter';

describe('UserPresenter unit tests', () => {
  const props = {
    id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
    name: 'test name',
    isSeller: false,
    email: 'a@a.com',
    password: 'fake',
    created_at: new Date(),
    updated_at: new Date(),
  };

  let sut: UserPresenter;

  beforeEach(() => {
    sut = new UserPresenter(props);
  });

  describe('constructor', () => {
    it('should set values', () => {
      expect(sut.id).toEqual(props.id);
      expect(sut.name).toEqual(props.name);
      expect(sut.email).toEqual(props.email);
      expect(sut.created_at).toEqual(props.created_at);
      expect(sut.updated_at).toEqual(props.updated_at);
    });

    it('should presenter data', () => {
      const output = instanceToPlain(sut);
      expect(output).toStrictEqual({
        id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
        name: 'test name',
        isSeller: false,
        email: 'a@a.com',
        created_at: sut.created_at.toISOString(),
        updated_at: sut.updated_at.toISOString(),
      });
    });
  });
});
