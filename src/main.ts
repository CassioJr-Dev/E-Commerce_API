import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyGlobalConfig } from './global-config';
import { EnvConfigService } from './shared/infrastructure/env-config/env-config.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('E-COMMERCE API')
    .setDescription(
      'Node.js Rest API - NestJs, Typescript, DDD, Clean Architecture and Automated Tests',
    )
    .setVersion('1.0.0')
    .addBearerAuth({
      description: 'Infomar o JWT para autorizar o acesso',
      name: 'Authorization',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  applyGlobalConfig(app);
  const port = app.get(EnvConfigService);
  await app.listen(port.getAppPort());
}
bootstrap();
