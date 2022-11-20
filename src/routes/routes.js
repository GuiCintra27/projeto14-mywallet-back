import {Router} from 'express';
import userRouter from './users.router.js';
import transactionsRouter from './transactions.router.js';

const router = Router();
router.use(userRouter);
router.use(transactionsRouter);
export default router;