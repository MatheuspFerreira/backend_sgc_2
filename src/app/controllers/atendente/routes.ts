import { Router } from 'express';
import AtendenteController from './atendente-controller';

const router = Router();


router.get('/', AtendenteController.list);
router.post('/autocomplete', AtendenteController.autoComplete);



export default router;