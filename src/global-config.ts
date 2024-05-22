import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import { WrapperDataInterceptor } from './shared/infrastructure/interceptors/wrapper-data/wrapper-data.interceptor';
import { Reflector } from '@nestjs/core';

export function applyGlobalConfig(app: INestApplication) {
  app.useGlobalInterceptors(
    new WrapperDataInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
}
