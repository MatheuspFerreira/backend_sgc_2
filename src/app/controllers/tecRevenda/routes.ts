import { Router } from 'express';
import TecRevendaController from './tecRevenda-controller';

const router = Router();


router.get('/', TecRevendaController.list);
router.post('/autocomplete', TecRevendaController.autoComplete);



export default router;