import { UserRepository } from '@/users/domain/repositories/user.repository';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserDto } from '../../dtos/update-user.dto';
import { PrismaClient } from '@prisma/client';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { setupPrismaTests } from '../../../../shared/infrastructure/database/testing/setup-prisma-tests';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { UsersModule } from '../../users.module';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { applyGlobalConfig } from '@/global-config';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import { UsersController } from '../../users.controller';
import { instanceToPlain } from 'class-transformer';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { BcryptjsHashProvider } from '../../providers/hash-provider/bcryptjs-hash.provider';
import request from 'supertest';

describe('UsersController unit tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: UserRepository.Repository;
  let updateUserDto: UpdateUserDto;
  const prismaService = new PrismaClient();
  let entity: UserEntity;
  let hashProvider: HashProvider;
  let hashPassword: string;
  let accessToken: string;

  beforeAll(async () => {
    setupPrismaTests();
    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule,
        UsersModule,
        DatabaseModule.forTest(prismaService),
      ],
    }).compile();
    app = module.createNestApplication();
    applyGlobalConfig(app);
    await app.init();
    repository = module.get<UserRepository.Repository>('UserRepository');
    hashProvider = new BcryptjsHashProvider();
    hashPassword = await hashProvider.generateHash('1234');
  });

  beforeEach(async () => {
    updateUserDto = {
      name: 'test name',
      isSeller: true,
      email: 'teste@a.com',
    };
    await prismaService.user.deleteMany();
    entity = new UserEntity(
      UserDataBuilder({
        email: 'a@a.com',
        password: hashPassword,
      }),
    );
    await repository.insert(entity);
    const loginResponse = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email: 'a@a.com', password: '1234' })
      .expect(200);
    accessToken = loginResponse.body.data.accessToken;
  });

  describe('PUT /users/:id', () => {
    it('Should update a user', async () => {
      const res = await request(app.getHttpServer())
        .put(`/users/${entity._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateUserDto)
        .expect(200);
      const user = await repository.findById(entity._id);
      const presenter = UsersController.userToResponse(user.toJSON());
      const serialized = instanceToPlain(presenter);
      expect(res.body.data.user).toStrictEqual(serialized);
    });

    it('Should return a error with 400 code when the request body is invalid', async () => {
      const res = await request(app.getHttpServer())
        .put(`/users/${entity._id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .expect(400);
      expect(res.body.error).toBe('Bad Request');
      expect(res.body.message).toEqual('No valid properties provided');
    });

    it('Should return a error with 404 code when throw NotFoundError with invalid id', async () => {
      const res = await request(app.getHttpServer())
        .put('/users/fakeId')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateUserDto)
        .expect(404)
        .expect({
          statusCode: 404,
          error: 'Not Found',
          message: 'UserModel not found using ID fakeId',
        });
    });

    it('should return a error with 401 code when the request is not authorized', async () => {
      const res = await request(app.getHttpServer())
        .put('/users/fakeId')
        .expect(401)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });
  });
});
