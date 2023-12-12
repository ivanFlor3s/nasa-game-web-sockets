import { Router } from 'express';
import * as userController from '../controller/user.controller.js';
import { validarJwt } from '../middlewares/validate-jwt.js';
import { isAdmin } from '../middlewares/is-admin.js';
export const router = Router();

router.put('/:id', [validarJwt], userController.updateUser);
router.get('/', [validarJwt, isAdmin], userController.getAll);
router.delete('/:id', [validarJwt, isAdmin], userController.deleteUser);
router.put('/:id/changeRol', [validarJwt, isAdmin], userController.changeRol);