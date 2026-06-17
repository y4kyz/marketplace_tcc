import express from "express";
import { pedidosDoVendedor } from "../controllers/vendedorController.js";
import { autenticarToken, apenasVendedor } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/pedidos", autenticarToken, apenasVendedor, pedidosDoVendedor);

export default router;