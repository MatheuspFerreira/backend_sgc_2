import { Router } from 'express';
import ContratoController from './contrato-controller';

const router = Router();

// Contratos
router.get('/', ContratoController.list);
router.get('/:id', ContratoController.obtain);
router.delete('/:id', ContratoController.destroy);
router.post('/', ContratoController.store);
router.post('/condicoes', ContratoController.canStore);
router.post('/condicoes/sufixo', ContratoController.checkSufixo);
router.post('/atendente/find', ContratoController.filter);
router.put('/deactivate/:prefix/:id', ContratoController.deactivate);
router.put('/reactivate/:prefix/:id', ContratoController.reactivate);
router.put('/cancel/:prefix/:id', ContratoController.cancel);


export default router;
