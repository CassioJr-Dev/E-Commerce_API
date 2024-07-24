import { instanceToPlain } from 'class-transformer';
import { CartPresenter } from '../../cart.presenter';

describe('CartPresenter unit tests', () => {
  const props = {
    id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
    user_id: '316f9563-eaf2-4563-b367-725a633c7039',
    created_at: new Date(),
    updated_at: new Date(),
  };

  let sut: CartPresenter;

  beforeEach(() => {
    sut = new CartPresenter(props);
  });

  describe('constructor', () => {
    it('should set values', () => {
      expect(sut.id).toEqual(props.id);
      expect(sut.user_id).toEqual(props.user_id);
      expect(sut.created_at).toEqual(props.created_at);
      expect(sut.updated_at).toEqual(props.updated_at);
    });

    it('should presenter data', () => {
      const output = instanceToPlain(sut);
      expect(output).toStrictEqual({
        id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
        user_id: '316f9563-eaf2-4563-b367-725a633c7039',
        created_at: sut.created_at.toISOString(),
        updated_at: sut.updated_at.toISOString(),
      });
    });
  });
});
