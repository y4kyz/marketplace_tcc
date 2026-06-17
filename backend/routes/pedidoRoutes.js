import express from "express";
import {
  checkout,
  listarPedidos,
  obterPedidoPorId
} from "../controllers/pedidoController.js";

import { autenticarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/checkout", autenticarToken, checkout);
router.get("/", autenticarToken, listarPedidos);
router.get("/detalhes/:id", autenticarToken, obterPedidoPorId);

export default router;