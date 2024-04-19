import { HashProvider } from '@/shared/application/providers/hash-provider';
import { BadRequestError } from '@/shared/domain/errors/bad-request-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserOutput, UserOutputMapper } from '../dtos/user-output';
import { UseCase as DefaultUseCase } from './use-case';

export namespace SignupUseCase {
  export type Input = {
    name: string;
    isSeller?: boolean;
    email: string;
    password: string;
  };

  export type Output = UserOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(
      private userRepository: UserRepository.Repository,
      private hashProvider: HashProvider,
    ) {}

    async execute(input: Input): Promise<Output> {
      const { name, isSeller = false, email, password } = input;
      if (!name || !email || !password) {
        throw new BadRequestError('Input data not provided');
      }

      await this.userRepository.emailExists(email);

      const hashPassword = await this.hashProvider.generateHash(password);

      const entity = new UserEntity({
        ...input,
        isSeller,
        password: hashPassword,
      });

      await this.userRepository.insert(entity);

      return UserOutputMapper.toOutput(entity);
    }
  }
}
