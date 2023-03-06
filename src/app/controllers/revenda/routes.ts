import { Router } from 'express';
import RevendaController from './revenda-controller'

const router = Router();


router.get('/', RevendaController.list);



export default router;