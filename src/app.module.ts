import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module';
import { UsersModule } from './users/infrastructure/users.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { AuthModule } from './auth/infrastructure/auth.module';
import { ProductsModule } from './products/infrastructure/products.module';

@Module({
  imports: [
    EnvConfigModule,
    UsersModule,
    DatabaseModule,
    AuthModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
