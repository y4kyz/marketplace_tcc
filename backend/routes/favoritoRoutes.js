import express from "express";
import {
  adicionarFavorito,
  removerFavorito,
  listarFavoritos
} from "../controllers/favoritoController.js";

import { autenticarToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", autenticarToken, adicionarFavorito);

router.delete("/:produto_id", autenticarToken, removerFavorito);

router.get("/", autenticarToken, listarFavoritos);

export default router;