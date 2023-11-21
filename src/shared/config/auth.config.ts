import { ConfigService } from '@nestjs/config';
import { envConfig } from './env.config';

class AuthConfig {
  constructor(private readonly config: ConfigService) {}

  get jwtSecret() {
    return this.config.get('JWT_SECRET');
  }
}

export const authConfig = new AuthConfig(envConfig);
