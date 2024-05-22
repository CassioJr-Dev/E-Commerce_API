import { of } from 'rxjs';
import { WrapperDataInterceptor } from '../../wrapper-data.interceptor';

describe('WrapperDataInterceptpr', () => {
  let interceptor: WrapperDataInterceptor;
  let props: any;

  beforeEach(() => {
    interceptor = new WrapperDataInterceptor();
    props = {
      name: 'Test Name',
      isSeller: false,
      email: 'a@a.com',
      password: 'fake',
    };
  });
  it('Should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('Should wrapper with data key', () => {
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of(props),
    });

    obs$.subscribe({
      next: value => {
        expect(value).toEqual({ data: props });
      },
    });
  });

  it('Should not wrapper when meta key is present', () => {
    const result = { data: [props], meta: { total: 1 } };
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of(result),
    });

    obs$.subscribe({
      next: value => {
        expect(value).toEqual(result);
      },
    });
  });
});
