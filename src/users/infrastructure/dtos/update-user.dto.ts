import { UpdateUserUseCase } from '@/users/application/usecases/update-user.usecase';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto implements Omit<UpdateUserUseCase.Input, 'id'> {

  @IsString()
  name?: string;

  @IsBoolean()
  isSeller?: boolean;

  @IsEmail()
  email?: string;
}
