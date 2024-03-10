import { DynamicModule, Module } from '@nestjs/common';
import { EnvConfigService } from './env-config.service';

@Module({
    imports: [],
    providers: [EnvConfigService],
    exports: [EnvConfigService]
})
export class EnvConfigModule{}
// export class EnvConfigModule extends ConfigModule {
//     static forRoot(options: ConfigModuleOptions = {}): DynamicModule {
//         return super.forRoot({
//             ...options,
//             envFilePath: [
//                 join(__dirname, `../../../../.env.${process.env.NODE_ENV}`),
//             ],
//         });
//     }
// }
