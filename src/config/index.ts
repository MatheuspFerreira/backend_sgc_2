import { config } from 'dotenv';
import * as path from 'path';

const basePath = path.join(__dirname, '../');

config();

export default {
  appPort: process.env.APP_PORT,
  jwt: {
    secret: process.env.APP_SECRET,
    expiresIn: process.env.NODE_ENV === 'production' ? '1d' : '9999 years',
  },
  dbConfig: {
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_CONNECTION_NAME,
    entities: [`${basePath}/database/entities/*.{js,ts}`],
    migrations: ['src/database/migration/**/*.ts'],
    cli: {
      migrationsDir: 'src/database/migration',
    },
  },
};
