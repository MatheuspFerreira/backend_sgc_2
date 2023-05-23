import 'express-async-errors';
import * as express from 'express';
import * as cors from 'cors';
import * as helmet from 'helmet';

import {
  authenticationHandler,
  errorHandler,
  notFoundHandler,
} from '../middlewares';
import authRoutes from './controllers/public/routes';
import userRoutes from './controllers/usuario/routes';
import suporteRoutes from './controllers/suporte/routes';
import contratoRoutes from './controllers/contrato/routes';
import revendaRoutes from './controllers/revenda/routes';
import atendenteRoutes from './controllers/atendente/routes';
import auditoriaRoutes from './controllers/auditoria/routes';
import tecRevendaRoutes from './controllers/tecRevenda/routes';
import tabPrecos from './controllers/tabPrecos/routes';
import faturas from './controllers/fatura/routes';

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/', authRoutes);

app.use(authenticationHandler);
app.use('/usuarios', userRoutes);
app.use('/suporte', suporteRoutes);
app.use('/contratos', contratoRoutes);
app.use('/revenda', revendaRoutes);
app.use('/atendente', atendenteRoutes);
app.use('/tecrevenda', tecRevendaRoutes);
app.use('/auditoria', auditoriaRoutes);
app.use('/tabprecos', tabPrecos);
app.use('/faturas', faturas);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
