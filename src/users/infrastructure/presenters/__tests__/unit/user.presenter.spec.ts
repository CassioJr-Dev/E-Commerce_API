import { instanceToPlain } from 'class-transformer';
import { UserCollectionPresenter, UserPresenter } from '../../user.presenter';
import { PaginationPresenter } from '@/shared/infrastructure/presenters/pagination.presenter';

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

  describe('UserCollectionPresenter unit tests', () => {
    const created_at = new Date();
    const updated_at = new Date();
    const props = {
      id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
      name: 'test name',
      isSeller: false,
      email: 'a@a.com',
      password: 'fake',
      created_at,
      updated_at,
    };

    describe('constructor', () => {
      it('should set values', () => {
        const sut = new UserCollectionPresenter({
          items: [props],
          currentPage: 1,
          perPage: 2,
          lastPage: 1,
          total: 1,
        });
        expect(sut.meta).toBeInstanceOf(PaginationPresenter);
        expect(sut.meta).toStrictEqual(
          new PaginationPresenter({
            currentPage: 1,
            perPage: 2,
            lastPage: 1,
            total: 1,
          }),
        );
        expect(sut.data).toStrictEqual([new UserPresenter(props)]);
      });
    });

    it('should presenter data', () => {
      let sut = new UserCollectionPresenter({
        items: [props],
        currentPage: 1,
        perPage: 2,
        lastPage: 1,
        total: 1,
      });
      let output = instanceToPlain(sut);
      expect(output).toStrictEqual({
        data: [
          {
            id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
            name: 'test name',
            isSeller: false,
            email: 'a@a.com',
            created_at: created_at.toISOString(),
            updated_at: updated_at.toISOString(),
          },
        ],
        meta: {
          currentPage: 1,
          perPage: 2,
          lastPage: 1,
          total: 1,
        },
      });

      sut = new UserCollectionPresenter({
        items: [props],
        currentPage: '1' as any,
        perPage: '2' as any,
        lastPage: '1' as any,
        total: '1' as any,
      });
      output = instanceToPlain(sut);
      expect(output).toStrictEqual({
        data: [
          {
            id: 'e71c52a2-9710-4a96-a08e-144af4209b5d',
            name: 'test name',
            isSeller: false,
            email: 'a@a.com',
            created_at: created_at.toISOString(),
            updated_at: updated_at.toISOString(),
          },
        ],
        meta: {
          currentPage: 1,
          perPage: 2,
          lastPage: 1,
          total: 1,
        },
      });
    });
  });
});
