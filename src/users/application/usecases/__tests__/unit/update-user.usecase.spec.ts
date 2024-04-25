import { UserInMemoryRepository } from '@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository';
import { UpdateUserUseCase } from '../../update-user.usecase';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { BadRequestError } from '@/shared/domain/errors/bad-request-error';

describe('UpdateUserUseCase unit tests', () => {
  let sut: UpdateUserUseCase.UseCase;
  let repository: UserInMemoryRepository;

  beforeEach(() => {
    repository = new UserInMemoryRepository();
    sut = new UpdateUserUseCase.UseCase(repository);
  });

  it('Should throws error when entity not found', async () => {
    await expect(() =>
      sut.execute({ id: 'fake', name: 'test name' }),
    ).rejects.toThrow(new NotFoundError('Entity not found'));
  });

  it('Should generate error when no properties are provided', async () => {
    repository.items = [new UserEntity(UserDataBuilder({}))];
    await expect(() =>
      sut.execute({ id: repository.items[0].id }),
    ).rejects.toThrow(new BadRequestError('No valid properties provided'));
  });

  it('Should update a user', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');
    const items = [new UserEntity(UserDataBuilder({}))];
    repository.items = items;

    const result = await sut.execute({
      id: items[0].id,
      name: 'new name',
      isSeller: true,
      email: 'newemail@gmail.com',
    });

    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      id: items[0].id,
      name: 'new name',
      isSeller: true,
      email: 'newemail@gmail.com',
      created_at: items[0].created_at,
      updated_at: items[0].updated_at,
    });
    console.log(result);
  });
});
