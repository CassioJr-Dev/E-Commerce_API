import { PrismaClient } from '@prisma/client';
import { UserPrismaRepository } from '../../user-prisma.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { setupPrismaTests } from '../../../testing/setup-prisma-tests';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UserRepository } from '@/users/domain/repositories/user.repository';

describe('UserPrismaRepository integration tests', () => {
  const prismaService = new PrismaClient();
  let sut: UserPrismaRepository;
  let module: TestingModule;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [DatabaseModule.forTest(prismaService)],
    }).compile();
  });

  beforeEach(async () => {
    sut = new UserPrismaRepository(prismaService as any);
    await prismaService.user.deleteMany();
  });

  afterAll(async () => {
    await prismaService.user.deleteMany();
  });

  it('Should throws error when entity not found', async () => {
    await expect(() => sut.findById('FakeId')).rejects.toThrow(
      new NotFoundError('UserModel not found usind ID FakeId'),
    );
  });

  it('Should finds a entity by id', async () => {
    const entity = new UserEntity(UserDataBuilder({}));

    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    });

    const output = await sut.findById(newUser.id);

    expect(output.toJSON()).toStrictEqual(entity.toJSON());
  });

  it('Should insert a new entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await sut.insert(entity);

    const result = await prismaService.user.findUnique({
      where: {
        id: entity._id,
      },
    });
    expect(result).toStrictEqual(entity.toJSON());
  });

  it('Should returns all users', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await prismaService.user.create({
      data: entity.toJSON(),
    });

    const entities = await sut.findAll();

    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
    entities.map(item => expect(item.toJSON()).toStrictEqual(entity.toJSON()));
  });

  it('Should throws error on update when a entity not found', async () => {
    const entity = new UserEntity(UserDataBuilder({}));

    await expect(() => sut.update(entity)).rejects.toThrow(
      new NotFoundError(`UserModel not found usind ID ${entity._id}`),
    );
  });

  it('Should update a entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    });
    entity.updateName('new name');
    await sut.update(entity);

    const output = await prismaService.user.findUnique({
      where: {
        id: entity.id,
      },
    });

    expect(output.name).toBe(`new name`);
  });

  it('Should throws error on delete when entity not found', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    await expect(() => sut.delete(entity.id)).rejects.toThrow(
      new NotFoundError(`UserModel not found usind ID ${entity.id}`),
    );
  });

  it('Should delete a entity', async () => {
    const entity = new UserEntity(UserDataBuilder({}));
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    });
    await sut.delete(entity.id);

    const output = await prismaService.user.findUnique({
      where: {
        id: entity.id,
      },
    });

    expect(output).toBeNull();
  });

  it('Should throws error when a entity not found', async () => {
    await expect(() => sut.findByEmail(`a@a.com`)).rejects.toThrow(
      new NotFoundError(`UserModel not found usind email a@a.com`),
    );
  });

  it('Should finds a entity by email', async () => {
    const entity = new UserEntity(UserDataBuilder({ email: 'a@a.com' }));
    const newUser = await prismaService.user.create({
      data: entity.toJSON(),
    });
    const output = await sut.findByEmail('a@a.com');

    expect(output.toJSON()).toStrictEqual(entity.toJSON());
  });
  describe('Search method tests', () => {
    it('Should apply only pagination when the other params are null', async () => {
      const created_at = new Date();
      const entities: UserEntity[] = [];

      const arrange = Array(16).fill(UserDataBuilder({}));
      arrange.forEach((element, index) => {
        entities.push(
          new UserEntity(
            {
              ...element,
              name: `User${index}`,
              email: `test${index}@gmail.com`,
            },
            undefined,
            new Date(created_at.getTime() + index),
          ),
        );
      });
      await prismaService.user.createMany({
        data: entities.map(item => item.toJSON()),
      });

      const searchOutput = await sut.search(new UserRepository.SearchParams());

      const items = searchOutput.items;

      expect(searchOutput).toBeInstanceOf(UserRepository.SearchResult);
      expect(searchOutput.total).toBe(16);
      expect(searchOutput.items.length).toBe(15);

      searchOutput.items.forEach(item => {
        expect(item).toBeInstanceOf(UserEntity);
      });

      items.reverse().forEach((item, index) => {
        expect(`test${index + 1}@gmail.com`).toBe(item.email);
      });
    });

    it('Should search using filter, sort and paginate', async () => {
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

      const searchOutputPage1 = await sut.search(
        new UserRepository.SearchParams({
          page: 1,
          perPage: 3,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      );

      console.log(searchOutputPage1.items);
      console.log(searchOutputPage1.sortDir);
      expect(searchOutputPage1.items[0].toJSON()).toMatchObject(
        entities[0].toJSON(),
      );
      expect(searchOutputPage1.items[1].toJSON()).toMatchObject(
        entities[4].toJSON(),
      );

      const searchOutputPage2 = await sut.search(
        new UserRepository.SearchParams({
          page: 2,
          perPage: 2,
          sort: 'name',
          sortDir: 'asc',
          filter: 'TEST',
        }),
      );

      expect(searchOutputPage2.items[0].toJSON()).toMatchObject(
        entities[2].toJSON(),
      );
    });
  });
});
