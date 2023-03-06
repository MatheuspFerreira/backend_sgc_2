import { Router } from 'express';
import AuthController from './auth-controller';

const router = Router();

router.post('/login', AuthController.login);
router.post('/verify-token', AuthController.verify);

export default router;
