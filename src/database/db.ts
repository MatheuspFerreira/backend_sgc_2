import { getConnectionManager } from 'typeorm';
import config from '../config';

const { dbConfig } = config;
const connectionManager = getConnectionManager();

export const suporteDb = connectionManager.create({
  name: 'default',
  type: 'mysql',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  entities: dbConfig.entities,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  // logging: true,
});
