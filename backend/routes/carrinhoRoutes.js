import express from "express";

import {
  adicionarItem,
  listarCarrinho,
  atualizarQuantidade,
  removerItem,
  limparCarrinho
} from "../controllers/carrinhoController.js";

import { autenticarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", autenticarToken, adicionarItem);

router.get("/", autenticarToken, listarCarrinho);

router.put("/:item_id", autenticarToken, atualizarQuantidade);

router.delete("/:item_id", autenticarToken, removerItem);

router.delete("/", autenticarToken, limparCarrinho);

export default router;