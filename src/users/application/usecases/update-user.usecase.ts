import { UserRepository } from '@/users/domain/repositories/user.repository';
import { UserOutput, UserOutputMapper } from '../dtos/user-output';
import { UseCase as DefaultUseCase } from '../../../shared/application/usecases/use-case';
import { BadRequestError } from '@/shared/domain/errors/bad-request-error';

export namespace UpdateUserUseCase {
  export type Input = {
    id: string;
    name?: string;
    isSeller?: boolean;
    email?: string;
  };


  export type Output = UserOutput;

  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private userRepository: UserRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const { id, name, email, isSeller } = input

      const isAllNull = !name && !email && typeof isSeller !== 'boolean'

      if(isAllNull) {
        throw new BadRequestError('No valid properties provided');
      }

      const entity = await this.userRepository.findById(id);

      if(name) {
        entity.updateName(name);
      }
      if(typeof isSeller === 'boolean') {
        entity.updateIsSeller(isSeller);
      }

      if(email) {
        email && entity.updateEmail(email);
      }

      await this.userRepository.update(entity);
      return UserOutputMapper.toOutput(entity);
    }
  }
}
