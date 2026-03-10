import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import produtosRoutes from './routes/produtos.js';
import authRoutes from './routes/authRoutes.js';
import path from "path";
import { fileURLToPath } from "url";
import carrinhoRoutes from './routes/carrinhoRoutes.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use('/carrinho', carrinhoRoutes);
app.use('/produtos', produtosRoutes);
app.use('/auth', authRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get('/', (req, res) => {
  res.send('API Marketplace funcionando 🚀');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
