import { EnvConfigService } from '@/shared/infrastructure/env-config/env-config.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

type GenerateJwtProps = {
  accessToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: EnvConfigService,
  ) {}

  async generateJwt(userId: string): Promise<GenerateJwtProps> {
    const accessToken = await this.jwtService.signAsync({ id: userId }, {});
    return { accessToken };
  }

  async verifyJwt(token: string) {
    return this.jwtService.verifyAsync(token, {
      secret: this.configService.getJwtSecret(),
    });
  }

  async extractPayload(tokenJwt: string) {
    const [type, token] = tokenJwt.split(' ') ?? [];

    if (type === 'Bearer') {
      return this.jwtService.decode(token);
    }

    return undefined;
  }
}
