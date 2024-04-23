import { SignupUseCase } from '@/users/application/usecases/signup.usecase';

export class SignupDto implements SignupUseCase.Input {
  name: string;
  isSeller?: boolean;
  email: string;
  password: string;
}
