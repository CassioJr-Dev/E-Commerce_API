import { SignupUseCase } from '@/users/application/usecases/signup.usecase';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignupDto implements SignupUseCase.Input {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  isSeller?: boolean;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
