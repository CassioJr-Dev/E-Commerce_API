import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { GetUserUseCase } from '../../getuser.usercase';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';

describe('GetUserUseCase unit tests', () => {
  let sut: GetUserUseCase.UseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new GetUserUseCase.UseCase(repository);
  });

  it('Should be able to get user profile', async () => {
    const spyFindById = jest.spyOn(repository, 'findById');
    const items = [new UserEntity(UserDataBuilder({}))];
    repository.items = items;
    const result = await sut.execute({ id: items[0]._id });

    console.log(result);
    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      id: items[0].id,
      name: items[0].name,
      isSeller: items[0].isSeller,
      email: items[0].email,
      password: items[0].password,
      created_at: items[0].created_at,
      updated_at: items[0].updated_at,
    });
  });
});
