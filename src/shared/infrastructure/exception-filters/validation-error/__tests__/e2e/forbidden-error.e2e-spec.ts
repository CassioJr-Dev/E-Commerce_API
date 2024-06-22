import { BadRequestError } from '@/shared/domain/errors/bad-request-error';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { ForbiddenErrorFilter } from '../../forbidden-error.filter';
import { ForbiddenError } from '@/shared/domain/errors/forbidden-error';

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new ForbiddenError('Forbidden data');
  }
}

describe('ForbiddenErrorFilter (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalFilters(new ForbiddenErrorFilter());
    await app.init();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(new ForbiddenErrorFilter()).toBeDefined();
  });

  it('should catch a ForbiddenError', () => {
    return request(app.getHttpServer()).get('/stub').expect(403).expect({
      statusCode: 403,
      error: 'Forbidden',
      message: 'Forbidden data',
    });
  });
});
