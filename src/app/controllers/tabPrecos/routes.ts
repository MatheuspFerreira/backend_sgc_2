import { Router } from 'express';
import TabPrecos from './tabPrecos-controller';

const router = Router();


router.get('/:id', TabPrecos.lastest);



export default router;