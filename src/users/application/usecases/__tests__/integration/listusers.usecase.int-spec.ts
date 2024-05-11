import { PrismaClient } from '@prisma/client';
import { ListUsersUseCase } from '../../listusers.usecase';
import { UserPrismaRepository } from '@/users/infrastructure/database/prisma/repositories/user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTests } from '@/users/infrastructure/database/prisma/testing/setup-prisma-tests';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';

describe('ListUsersUseCase integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: ListUsersUseCase.UseCase;
  let repository: UserPrismaRepository;
  let module: TestingModule;
  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
    repository = new UserPrismaRepository(prismaService as any);
  });
  beforeEach(async () => {
    sut = new ListUsersUseCase.UseCase(repository);
    await prismaService.user.deleteMany();
  });
  afterAll(async () => {
    await module.close();
  });
  it('Should return the users ordered by created_at', async () => {
    const created_at = new Date();
    const entities: UserEntity[] = [];
    const arrange = Array(3).fill(UserDataBuilder({}));
    arrange.forEach((element, index) => {
      entities.push(
        new UserEntity(
          {
            ...element,
            email: `test${index}@mail.com`,
          },
          undefined,
          new Date(created_at.getTime() + index),
        ),
      );
    });
    await prismaService.user.createMany({
      data: entities.map(item => item.toJSON()),
    });
    const output = await sut.execute({});
    expect(output).toStrictEqual({
      items: entities.reverse().map(item => item.toJSON()),
      total: 3,
      currentPage: 1,
      perPage: 15,
      lastPage: 1,
    });
  });

  it('Should returns output using filter, sort and paginate', async () => {
    const created_at = new Date();
    const entities: UserEntity[] = [];
    const arrange = ['test', 'a', 'TEST', 'b', 'TeSt'];
    arrange.forEach((element, index) => {
      entities.push(
        new UserEntity(
          {
            ...UserDataBuilder({ name: element }),
          },
          undefined,
          new Date(created_at.getTime() + index),
        ),
      );
    });

    await prismaService.user.createMany({
      data: entities.map(item => item.toJSON()),
    });

    let output = await sut.execute({
      page: 1,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'TEST',
    });

    expect(output).toMatchObject({
      items: [entities[0].toJSON(), entities[4].toJSON()],
      total: 3,
      currentPage: 1,
      perPage: 2,
      lastPage: 2,
    });

    output = await sut.execute({
      page: 2,
      perPage: 2,
      sort: 'name',
      sortDir: 'asc',
      filter: 'TEST',
    });

    expect(output).toMatchObject({
      items: [entities[2].toJSON()],
      total: 3,
      currentPage: 2,
      perPage: 2,
      lastPage: 2,
    });
  });
});
