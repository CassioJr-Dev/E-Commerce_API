import { UserRepository } from '@/users/domain/repositories/user.repository';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdatePasswordDto } from '../../dtos/update-password.dto';
import { PrismaClient } from '@prisma/client';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { UserEntity } from '@/users/domain/entities/user.entity';
import { setupPrismaTests } from '../../database/prisma/testing/setup-prisma-tests';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { UsersModule } from '../../users.module';
import { DatabaseModule } from '@/shared/infrastructure/database/database.module';
import { applyGlobalConfig } from '@/global-config';
import { BcryptjsHashProvider } from '../../providers/hash-provider/bcryptjs-hash.provider';
import { UserDataBuilder } from '@/users/domain/testing/helpers/user-data-builder';
import request from 'supertest';

describe('UsersController e2e tests', () => {
  let app: INestApplication;
  let module: TestingModule;
  let repository: UserRepository.Repository;
  let updatePasswordDto: UpdatePasswordDto;
  const prismaService = new PrismaClient();
  let hashProvider: HashProvider;
  let entity: UserEntity;

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
  });

  beforeEach(async () => {
    updatePasswordDto = {
      password: 'new_password',
      oldPassword: 'old_password',
    };
    await prismaService.user.deleteMany();
    const hashPassword = await hashProvider.generateHash('old_password');
    entity = new UserEntity(UserDataBuilder({ password: hashPassword }));
    await repository.insert(entity);
  });

  describe('POST /users', () => {
    it('should update a password', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/users/${entity._id}`)
        .send(updatePasswordDto)
        .expect(200);
      expect(Object.keys(res.body)).toStrictEqual(['data']);
      const user = await repository.findById(res.body.data.id);
      const checkNewPassword = await hashProvider.compareHash(
        'new_password',
        user.password,
      );
      expect(checkNewPassword).toBeTruthy();
    });

    it('should return a error with 422 code when the request body is invalid', async () => {
      const res = await request(app.getHttpServer())
        .patch('/users/fakeId')
        .send({})
        .expect(422);
      expect(res.body.error).toBe('Unprocessable Entity');
      expect(res.body.message).toEqual([
        'password should not be empty',
        'password must be a string',
        'oldPassword should not be empty',
        'oldPassword must be a string',
      ]);
    });

    it('Should return a error with 404 code when throw NotFoundError with invalid id', async () => {
      const res = await request(app.getHttpServer())
        .patch('/users/fakeId')
        .send(updatePasswordDto)
        .expect(404);
      expect(res.body.error).toBe('Not Found');
      expect(res.body.message).toEqual('UserModel not found using ID fakeId');
    });
  });
});
