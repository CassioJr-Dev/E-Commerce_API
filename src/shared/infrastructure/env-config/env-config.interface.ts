export interface EnvConfig {
  getAppPort(): number;
  getJwtSecret(): string;
  getJwtExpiresInSeconds(): number;
}
