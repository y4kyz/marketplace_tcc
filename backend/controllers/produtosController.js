import pool from '../config/db.js';

export const listarProdutos = async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();

    const produtos = await conn.query(`
      SELECT 
        produtos.id,
        produtos.nome,
        produtos.descricao,
        produtos.preco,
        produtos.estoque,
        categorias.nome AS categoria,
        usuarios.nome AS vendedor
      FROM produtos
      LEFT JOIN categorias ON produtos.categoria_id = categorias.id
      LEFT JOIN usuarios ON produtos.vendedor_id = usuarios.id
      WHERE produtos.ativo = 1
    `);

    res.json(produtos);

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar produtos' });
  } finally {
    if (conn) conn.release();
  }
};
//buscar produto
export const buscarProdutoPorId = async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();

    const produto = await conn.query(
      `SELECT * FROM produtos WHERE id = ? AND ativo = 1`,
      [req.params.id]
    );

    if (produto.length === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    res.json(produto[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar produto' });
  } finally {
    if (conn) conn.release();
  }
};
//cria produto
export const criarProduto = async (req, res) => {
  let conn;

  const { nome, descricao, preco, estoque, categoria_id } = req.body;
  const vendedor_id = req.usuario.id;
  const imagem = req.file ? req.file.filename : null;

  try {
    conn = await pool.getConnection();

    const resultado = await conn.query(
      `INSERT INTO produtos 
      (nome, descricao, preco, estoque, categoria_id, vendedor_id, imagem, ativo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nome, descricao, preco, estoque, categoria_id, vendedor_id, imagem, 1]
    );

    res.status(201).json({
      mensagem: 'Produto criado com sucesso',
      id: resultado.insertId.toString() 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao criar produto' });
  } finally {
    if (conn) conn.release();
  }
};
//atualiza produto
export const atualizarProduto = async (req, res) => {
  let conn;

  const { nome, descricao, preco, estoque } = req.body;

  try {
    conn = await pool.getConnection();

    await conn.query(
      `UPDATE produtos
       SET nome = ?, descricao = ?, preco = ?, estoque = ?
       WHERE id = ? AND vendedor_id = ?`,
      [nome, descricao, preco, estoque, req.params.id, req.usuario.id]
    );

    res.json({ mensagem: 'Produto atualizado com sucesso' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao atualizar produto' });
  } finally {
    if (conn) conn.release();
  }
};
//apaga produto
export const deletarProduto = async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();

    await conn.query(
      `UPDATE produtos
       SET ativo = 0
       WHERE id = ? AND vendedor_id = ?`,
      [req.params.id, req.usuario.id]
    );
    
    res.json({ mensagem: 'Produto removido com sucesso' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao remover produto' });
  } finally {
    if (conn) conn.release();
  }
};