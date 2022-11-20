import { Router } from 'express';
import { signUp, signIn } from "../controllers/users.controller.js";
import { signInValidation, signUpValidation } from '../middlewares/userValidation.middleware.js';

const userRouter = Router();

userRouter.post('/sign-up', signUpValidation, signUp);

userRouter.post('/sign-in', signInValidation, signIn);

export default userRouter;