import { Router } from 'express';
import { incomingTransaction, outgoingTransaction, getTransactions } from "../controllers/transactions.controller.js";
import validateTransaction from '../middlewares/transactionValidation.middleware.js';
import authValidation from '../middlewares/authValidation.middleware.js';

const transactionsRouter = Router();

transactionsRouter.use(authValidation);

transactionsRouter.post('/incoming', validateTransaction, incomingTransaction);

transactionsRouter.post('/outgoing', validateTransaction, outgoingTransaction);

transactionsRouter.get('/transactions', getTransactions);

export default transactionsRouter;