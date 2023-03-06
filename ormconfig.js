const { join } = require('path');

const entitiesPath = join(
  __dirname,
  'dist',
  'database',
  'entities',
  '/*.{js,ts}'
);

const migrationsPath = join(__dirname, 'dist', 'database', 'migration', '*.js');
const migrationsDir = join(__dirname, 'src', 'database', 'migration');

// const migrationsDir = ("./src/database/migration");

module.exports = {
  name: 'default',
  type: 'mysql',
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  synchronize: false,
  entities: [entitiesPath],
  migrations: [migrationsPath],
  cli: {
    migrationsDir,
  },
};
