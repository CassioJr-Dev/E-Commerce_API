import { UpdateUserUseCase } from '@/users/application/usecases/update-user.usecase';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto implements Omit<UpdateUserUseCase.Input, 'id'> {
  @ApiPropertyOptional({ description: 'Nome do usuário' })
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Usuário é vendedor ou não' })
  @IsBoolean()
  isSeller?: boolean;

  @ApiPropertyOptional({ description: 'E-mail do usuário' })
  @IsEmail()
  email?: string;
}
