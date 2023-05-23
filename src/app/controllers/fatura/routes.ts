import { Router } from 'express';
import faturaController from './fatura-controller';

const router = Router();

// Faturas
router.get('/latest/:year', faturaController.getLatestList)
router.get('/itens/:date', faturaController.getFaturaItens)
router.post('/contest', faturaController.contest)




export default router;
