import { Router } from 'express';
import RevendaController from './revenda-controller'

const router = Router();


router.get('/', RevendaController.list);
router.get('/active', RevendaController.listActive);
router.post('/autocomplete', RevendaController.autoComplete);



export default router;