import express from "express";

import {
  listarProdutos,
  buscarProdutoPorId,
  criarProduto,
  atualizarProduto,
  deletarProduto
} from "../controllers/produtosController.js";

import {
  autenticarToken,
  apenasVendedor
} from "../middlewares/authMiddleware.js";

import upload from "../middlewares/uploadMiddleware.js";

import {
  validarProduto
} from "../middlewares/validators/produtoValidator.js";

const router = express.Router();

// Públicas
router.get("/", listarProdutos);
router.get("/:id", buscarProdutoPorId);

// Privadas vendedor
router.post(
  "/",
  autenticarToken,
  apenasVendedor,
  upload.single("imagem"), // 1. O Multer lê o FormData primeiro e monta o req.body
  validarProduto,          // 2. Agora o validador consegue ler os campos sem dar undefined!
  criarProduto
);

router.put(
  "/:id",
  autenticarToken,
  apenasVendedor,
  upload.single("imagem"), // Mesma correção aplicada na rota de atualização
  validarProduto,
  atualizarProduto
);

router.delete(
  "/:id",
  autenticarToken,
  apenasVendedor,
  deletarProduto
);

export default router;