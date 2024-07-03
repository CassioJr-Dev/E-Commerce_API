import { PrismaClient, User } from '@prisma/client';
import { setupPrismaTests } from '../../../../../../../shared/infrastructure/database/testing/setup-prisma-tests';
import { UserModelMapper } from '../../user-model.mapper';
import { ValidationError } from '@/shared/domain/errors/validation-error';
import { UserEntity } from '@/users/domain/entities/user.entity';

describe('UserModelMapper integration tests', () => {
  let prismaService: PrismaClient;
  let props: any;

  beforeAll(async () => {
    setupPrismaTests();
    prismaService = new PrismaClient();
    await prismaService.$connect();
  });

  beforeEach(async () => {
    await prismaService.user.deleteMany();
    props = {
      id: 'd4255494-f981-4d26-a2a1-35d3f5b8d36a',
      name: 'Test name',
      isSeller: true,
      email: 'a@a.com',
      password: 'TestPassword123',
      created_at: new Date(),
      updated_at: new Date(),
    };
  });

  afterAll(async () => {
    await prismaService.$disconnect();
  });

  it('Should throws error when user model is invalid', async () => {
    const model: User = Object.assign(props, { name: null });

    expect(() => {
      UserModelMapper.toEntity(model);
    }).toThrowError(new ValidationError('An entity not be loaded'));
  });

  it('Should convert a user model to a user entity', async () => {
    const model: User = await prismaService.user.create({
      data: props,
    });
    const sut = UserModelMapper.toEntity(model);

    expect(sut).toBeInstanceOf(UserEntity);

    expect(sut.toJSON()).toStrictEqual(props);
  });
});
