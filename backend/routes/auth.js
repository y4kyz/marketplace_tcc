import express from 'express';
import { login, register } from '../controllers/authController.js'; // Lembra-te da extensão .js
import { validarRegistro, validarLogin } from '../middlewares/authValidator.js';

const router = express.Router();

// Rota de Registo
router.post('/register', validarRegistro, register);

// Rota de Login
router.post('/login', validarLogin, login);

export default router;