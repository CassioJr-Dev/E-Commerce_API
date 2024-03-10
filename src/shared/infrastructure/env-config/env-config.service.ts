import { Injectable } from '@nestjs/common';
import { EnvConfig } from './env-config.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvConfigService implements EnvConfig {
    constructor(private confiservice: ConfigService) {}
    getAppPort(): number {
        return Number(this.confiservice.get<number>('PORT'));
    }
}
