import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { applyGlobalConfig } from './global-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  applyGlobalConfig(app);
  await app.listen(3000);
}
bootstrap();
