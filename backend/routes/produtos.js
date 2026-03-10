import express from "express";
import {
  listarProdutos,
  buscarProdutoPorId,
  criarProduto,
  atualizarProduto,
  deletarProduto
} from "../controllers/produtosController.js";

import { autenticarToken, apenasVendedor } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/", listarProdutos);
router.get("/:id", buscarProdutoPorId);

router.post(
  "/",
  autenticarToken,
  apenasVendedor,
  upload.single("imagem"),
  criarProduto
);

router.put(
  "/:id",
  autenticarToken,
  apenasVendedor,
  atualizarProduto
);

router.delete(
  "/:id",
  autenticarToken,
  apenasVendedor,
  deletarProduto
);

export default router;