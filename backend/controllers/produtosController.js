import pool from "../config/db.js";

// LISTAR PRODUTOS
export const listarProdutos = async (req, res) => {

  let conn;

  try {

    conn = await pool.getConnection();

    const {
      busca,
      categoria,
      min,
      max,
      page = 1,
      limit = 10,
      sort
    } = req.query;

    const offset = (page - 1) * limit;

    let baseQuery = `
      FROM produtos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      LEFT JOIN usuarios u ON p.vendedor_id = u.id
      WHERE p.ativo = 1
    `;

    const params = [];

    if (busca) {
      baseQuery += " AND p.nome LIKE ?";
      params.push(`%${busca}%`);
    }

    if (categoria) {
      baseQuery += " AND p.categoria_id = ?";
      params.push(categoria);
    }

    if (min) {
      baseQuery += " AND p.preco >= ?";
      params.push(min);
    }

    if (max) {
      baseQuery += " AND p.preco <= ?";
      params.push(max);
    }

    let order = " ORDER BY p.criado_em DESC";

    if (sort === "preco_asc") {
      order = " ORDER BY p.preco ASC";
    }

    if (sort === "preco_desc") {
      order = " ORDER BY p.preco DESC";
    }

    if (sort === "nome") {
      order = " ORDER BY p.nome ASC";
    }

    const produtos = await conn.query(
      `SELECT
    p.id,
    p.nome,
    p.descricao,
    p.preco,
    p.estoque,
    p.imagem,
    p.vendedor_id,
    c.nome AS categoria,
    u.nome AS vendedor
  ${baseQuery}
  ${order}
  LIMIT ? OFFSET ?`,
      [...params, Number(limit), Number(offset)]
    );

    const totalResult = await conn.query(
      `SELECT COUNT(*) AS total ${baseQuery}`,
      params
    );

    const total = totalResult[0].total;

    res.json({
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
      produtos
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: "Erro ao buscar produtos"
    });

  } finally {

    if (conn) conn.release();

  }
};

// BUSCAR PRODUTO
export const buscarProdutoPorId = async (req, res) => {

  let conn;

  try {

    conn = await pool.getConnection();

    const produto = await conn.query(
      `SELECT * FROM produtos
       WHERE id = ? AND ativo = 1`,
      [req.params.id]
    );

    if (produto.length === 0) {
      return res.status(404).json({
        erro: "Produto não encontrado"
      });
    }

    res.json(produto[0]);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: "Erro ao buscar produto"
    });

  } finally {

    if (conn) conn.release();

  }
};

// CRIAR PRODUTO
export const criarProduto = async (req, res) => {

  let conn;

  try {

    conn = await pool.getConnection();

    const {
      nome,
      descricao,
      preco,
      estoque,
      categoria_id
    } = req.body;

    const vendedor_id = req.user.id;

    const imagem = req.file
      ? req.file.filename
      : null;

    const resultado = await conn.query(
      `INSERT INTO produtos
      (
        nome,
        descricao,
        preco,
        estoque,
        categoria_id,
        vendedor_id,
        imagem,
        ativo
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome,
        descricao,
        preco,
        estoque,
        categoria_id,
        vendedor_id,
        imagem,
        1
      ]
    );

    res.status(201).json({
      mensagem: "Produto criado com sucesso",
      id: resultado.insertId
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: "Erro ao criar produto"
    });

  } finally {

    if (conn) conn.release();

  }
};

// ATUALIZAR PRODUTO
export const atualizarProduto = async (req, res) => {

  let conn;

  try {

    conn = await pool.getConnection();

    const {
      nome,
      descricao,
      preco,
      estoque,
      categoria_id
    } = req.body;

    const imagem = req.file
      ? req.file.filename
      : null;

    await conn.query(
      `UPDATE produtos
       SET
         nome = ?,
         descricao = ?,
         preco = ?,
         estoque = ?,
         categoria_id = ?,
         imagem = COALESCE(?, imagem)
       WHERE id = ?
       AND vendedor_id = ?`,
      [
        nome,
        descricao,
        preco,
        estoque,
        categoria_id,
        imagem,
        req.params.id,
        req.user.id
      ]
    );

    res.json({
      mensagem: "Produto atualizado com sucesso"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: "Erro ao atualizar produto"
    });

  } finally {

    if (conn) conn.release();

  }
};

// DELETAR PRODUTO
export const deletarProduto = async (req, res) => {

  let conn;

  try {

    conn = await pool.getConnection();

    await conn.query(
      `UPDATE produtos
       SET ativo = 0
       WHERE id = ?
       AND vendedor_id = ?`,
      [req.params.id, req.user.id]
    );

    res.json({
      mensagem: "Produto removido com sucesso"
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: "Erro ao remover produto"
    });

  } finally {

    if (conn) conn.release();

  }
};