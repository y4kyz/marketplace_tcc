import express from "express";
import {
  criarAvaliacao,
  listarAvaliacoesProduto,
  mediaAvaliacoesProduto
} from "../controllers/avaliacaoController.js";

import { autenticarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", autenticarToken, criarAvaliacao);

router.get("/produto/:produto_id", listarAvaliacoesProduto);

router.get("/produto/:produto_id/media", mediaAvaliacoesProduto);

export default router;