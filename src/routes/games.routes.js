import { Router } from 'express';
import { validarJwt } from '../middlewares/validate-jwt.js';
import * as gameController from '../controller/game.controller.js';

export const router = Router();

router.get('/current', [validarJwt], gameController.getCurrentGame);
router.post('/', [validarJwt], gameController.createGame);