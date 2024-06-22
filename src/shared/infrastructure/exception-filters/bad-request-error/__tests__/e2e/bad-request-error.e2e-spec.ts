import { BadRequestError } from '@/shared/domain/errors/bad-request-error';
import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { BadRequestErrorFilter } from '../../bad-request-error.filter';

@Controller('stub')
class StubController {
  @Get()
  index() {
    throw new BadRequestError('Bad Request data');
  }
}

describe('BadRequestErrorFilter (e2e)', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [StubController],
    }).compile();
    app = module.createNestApplication();
    app.useGlobalFilters(new BadRequestErrorFilter());
    await app.init();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(new BadRequestErrorFilter()).toBeDefined();
  });

  it('should catch a BadRequestError', () => {
    return request(app.getHttpServer()).get('/stub').expect(400).expect({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Bad Request data',
    });
  });
});
