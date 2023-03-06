import { Router } from 'express';
import ProdutoController from './produto-controller';
import ClienteController from './cliente-controller';

const router = Router();

// Produtos
router.get('/produtos', ProdutoController.list);

// Clientes
router.get('/clientes/:doc', ClienteController.list);
router.get('/clientes/obtain/:codcliente', ClienteController.obtain);
router.put('/clientes/:codcliente', ClienteController.update);
router.post('/clientes', ClienteController.store);

export default router;
