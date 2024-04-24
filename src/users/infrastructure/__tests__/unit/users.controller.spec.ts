import { UserOutput } from '@/users/application/dtos/user-output';
import { UsersController } from '../../users.controller';
import { SignupUseCase } from '@/users/application/usecases/signup.usecase';
import { SignupDto } from '../../dtos/signup.dto';

describe('UsersController unit tests', () => {
  let sut: UsersController;
  let id: string;
  let props: UserOutput;

  beforeEach(async () => {
    sut = new UsersController();
    id = 'df96ae94-6128-486e-840c-b6f78abb4801';
    props = {
      id,
      name: 'Name Test',
      isSeller: true,
      email: 'a@a.com',
      password: '1234',
      created_at: new Date(),
      update_at: new Date(),
    };
  });

  it('Should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('Should create a user', async () => {
    const output: SignupUseCase.Output = props;
    const mockSignupUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output)),
    };
    sut['signupUseCase'] = mockSignupUseCase as any;
    const input: SignupDto = {
      name: 'Name Test',
      email: 'a@a.com',
      password: '1234',
    };

    const result = await sut.create(input);

    expect(output).toMatchObject(result);
    expect(mockSignupUseCase.execute).toHaveBeenCalledWith(input);
  });
});
