import config from './config';
import { suporteDb } from './database/db';
import server from './app';

(async () => {
  await Promise.all([suporteDb.connect()]);
  server.listen(config.appPort);
})();
