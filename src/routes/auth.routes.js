import { Router } from 'express';
import * as UserController from "../controller/auth.controller.js";

export const router = Router();


router.post('/register', UserController.register)
router.post('/login', UserController.login)