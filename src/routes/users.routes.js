import { Router } from 'express';
import * as userController from '../controller/user.controller.js';
export const router = Router();

router.put('/:id', userController.updateUser );
