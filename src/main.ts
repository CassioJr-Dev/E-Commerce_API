import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyGlobalConfig } from './global-config';
import { EnvConfigService } from './shared/infrastructure/env-config/env-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  applyGlobalConfig(app);
  const port = app.get(EnvConfigService);
  await app.listen(port.getAppPort());
}
bootstrap();
