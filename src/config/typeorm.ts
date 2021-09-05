import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const { DB_USER, DB_PASSWORD, DB_NAME, DB_SYNC, DB_HOST, DB_LOGGING, DB_PORT } =
  process.env;

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: DB_SYNC === 'true',
  logging: DB_LOGGING === 'true',
};

export { typeOrmConfig };
