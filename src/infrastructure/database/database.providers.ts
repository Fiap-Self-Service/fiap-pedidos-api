import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const isTestEnv = process.env.NODE_ENV === 'test';
      const dataSourceConfig: DataSourceOptions = isTestEnv
        ? {
            type: 'sqlite',
            database: ':memory:',
            entities: [__dirname + '/../../core/**/*.entity{.ts,.js}'],
            synchronize: true,
          }
        : {
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_DATABASE,
            entities: [__dirname + '/../../core/**/*.entity{.ts,.js}'],
            synchronize: true,
          };

      const dataSource = new DataSource(dataSourceConfig);
      return dataSource.initialize();
    },
  },
];
