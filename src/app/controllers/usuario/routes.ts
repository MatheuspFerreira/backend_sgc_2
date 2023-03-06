import { Router } from 'express';
import NotificationController from './notificacao-controller';

const router = Router();

// Notificações/Alertas
router.get('/notificacoes', NotificationController.list);
router.get('/notificacoes/:id', NotificationController.show);
router.put('/notificacoes/:id', NotificationController.update);
router.delete('/notificacoes/:id', NotificationController.destroy);

export default router;
