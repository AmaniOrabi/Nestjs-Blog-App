import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';

dotenv.config();
export const envConfig = new ConfigService({
  ...process.env,
});
