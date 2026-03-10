import express from "express";
import {
  criarCarrinho,
  adicionarItem,
  listarCarrinho,
  removerItem
} from "../controllers/carrinhoController.js";

import { autenticarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", autenticarToken, criarCarrinho);

router.post("/item", autenticarToken, adicionarItem);

router.get("/", autenticarToken, listarCarrinho);

router.delete("/item/:item_id", autenticarToken, removerItem);

export default router;