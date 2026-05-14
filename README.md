E-Commerce Full-Stack API

API REST desenvolvida para um sistema de E-Commerce Full-Stack como Trabalho de Conclusão de Curso (TCC) da ETEC.

O projeto foi desenvolvido utilizando arquitetura MVC com autenticação JWT, upload de imagens, gerenciamento de produtos, carrinho de compras e sistema de pedidos.

Tecnologias Utilizadas

Node.js
Express.js
MariaDB
JWT (JSON Web Token)
Bcrypt
Multer
Joi
Swagger
Banco de Dados
MariaDB / MySQL

Ferramentas

Postman
Nodemon
Git & GitHub

Funcionalidades Implementadas

Autenticação
Cadastro de usuários
Login com JWT
Proteção de rotas
Controle de permissões por tipo de usuário
Produtos
Criar produto
Listar produtos
Buscar produto por ID
Atualizar produto
Soft delete
Upload de imagens
Carrinho
Adicionar item
Atualizar quantidade
Remover item
Limpar carrinho
Listagem com total automático
Pedidos
Checkout
Criação de pedidos
Histórico de pedidos
Detalhamento de pedidos
Documentação
Swagger UI integrado
Endpoints documentados

Arquitetura

O backend foi estruturado utilizando padrão MVC:

backend/
│
├── config/
├── controllers/
├── middlewares/
├── routes/
├── uploads/
├── validators/
└── server.js

Segurança
Senhas criptografadas com Bcrypt
Autenticação JWT
Rotas protegidas
Validação de dados com Joi
Controle de acesso para vendedores
Upload de Imagens

O sistema permite upload de imagens de produtos utilizando Multer.

Formatos aceitos:

JPG
PNG
WEBP

Banco de Dados

Principais tabelas:

usuarios
produtos
carrinho_itens
pedidos
itens_pedido
categorias

Como Executar o Projeto

1. Clonar repositório
git clone URL_DO_REPOSITORIO

2. Instalar dependências
npm install

3. Configurar .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=marketplace_tcc
PORT=3000
JWT_SECRET= sua chave

4.Subir o banco de dados
(Nesse caso eu usei o xampp)

mysql -u root -p
create database marketplace_tcc
use marketplace_tcc
source (lugar do arquivo)
;

5. Iniciar servidor
npm run dev


Documentação Swagger

Após iniciar o servidor:

http://localhost:3000/api-docs

Testes

Todos os endpoints foram testados utilizando:

Postman
Swagger
Autor

Desenvolvido por Guilherme Tavares Barros.

Projeto acadêmico desenvolvido para conclusão do curso técnico da ETEC.
