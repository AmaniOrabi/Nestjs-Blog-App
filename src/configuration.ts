export interface Configs {
  PORT: number;
  DATABASE_URL: string;
  APP_MODE: string;
  JWT_SECRET: string;
}
export default (): Configs => ({
  PORT: Number(process.env.PORT),
  DATABASE_URL: process.env.DATABASE_URL,
  APP_MODE: process.env.APP_MODE,
  JWT_SECRET: process.env.JWT_SECRET,
});
