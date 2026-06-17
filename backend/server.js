import dotenv from 'dotenv';
// Inicializa o .env antes de qualquer importação de rota
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url";

// Importação das Rotas
import produtosRoutes from './routes/produtoRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js';
import authRoutes from './routes/auth.js';
import carrinhoRoutes from './routes/carrinhoRoutes.js';
import avaliacaoRoutes from "./routes/avaliacaoRoutes.js";
import favoritoRoutes from "./routes/favoritoRoutes.js";

// Swagger
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();
const PORT = process.env.PORT || 3000; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do Swagger 
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Marketplace TCC',
      version: '1.0.0',
      description: 'Documentação do sistema de Marketplace',
    },
    servers: [
      { url: `http://localhost:${PORT}` },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      { bearerAuth: [] },
    ],
  },
  apis: ['./routes/*.js', './controllers/*.js'],
};

const specs = swaggerJsdoc(swaggerOptions);

// Middlewares Globais
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos (Imagens)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rotas da API
app.use('/auth', authRoutes);
app.use('/produtos', produtosRoutes);
app.use('/carrinho', carrinhoRoutes);
app.use('/pedidos', pedidoRoutes);
app.use("/avaliacoes", avaliacaoRoutes);
app.use("/favoritos", favoritoRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/', (req, res) => {
  res.send('API Marketplace funcionando 🚀');
});

// Middleware de Erro Global
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo deu errado internamente!' });
});

app.listen(PORT, () => {
  console.log(`\n✅ Servidor rodando na porta ${PORT}`);
  console.log(`📖 Documentação: http://localhost:${PORT}/api-docs\n`);
});