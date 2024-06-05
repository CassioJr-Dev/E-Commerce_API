import { UpdateUserUseCase } from '@/users/application/usecases/update-user.usecase';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto implements Omit<UpdateUserUseCase.Input, 'id'> {
  @ApiPropertyOptional({ description: 'Nome do usuário' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Usuário é vendedor ou não' })
  @IsOptional()
  @IsBoolean()
  isSeller?: boolean;

  @ApiPropertyOptional({ description: 'E-mail do usuário' })
  @IsOptional()
  @IsEmail()
  email?: string;
}
