import { Router } from 'express';
import { incomingTransaction, outgoingTransaction, getTransactions } from "../controllers/transactions.controller.js";
import validateTransaction from '../middlewares/transactionValidation.middleware.js';

const transactionsRouter = Router();

transactionsRouter.use(validateTransaction)

transactionsRouter.post('/incoming', incomingTransaction);

transactionsRouter.post('/outgoing', outgoingTransaction);

transactionsRouter.get('/transactions', getTransactions);

export default transactionsRouter;