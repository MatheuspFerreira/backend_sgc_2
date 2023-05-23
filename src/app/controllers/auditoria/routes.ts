import { Router } from 'express';
import AuditoriaController from './auditoria-controller';

const router = Router();

// auditoria
router.get('/:id', AuditoriaController.obtain);
router.post('/filter',  AuditoriaController.filter);

export default router;
