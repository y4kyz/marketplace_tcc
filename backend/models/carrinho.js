import pool from '../config/db.js';

// Criar carrinho (caso não exista)
export const criarCarrinho = async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();
    const vendedor_id = req.user.id;

    const existente = await conn.query(
      `SELECT id FROM carrinho WHERE vendedor_id = ?`,
      [vendedor_id]
    );

    if (existente.length > 0) {
      return res.json({
        mensagem: "Carrinho já existe",
        carrinho_id: existente[0].id
      });
    }

    const result = await conn.query(
      `INSERT INTO carrinho (vendedor_id) VALUES (?)`,
      [vendedor_id]
    );

    res.json({
      mensagem: "Carrinho criado",
      carrinho_id: result.insertId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao criar carrinho" });
  } finally {
    if (conn) conn.release();
  }
};

// Adicionar item (com verificação de duplicado)
export const adicionarItem = async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();

    const vendedor_id = req.user.id;
    const { produto_id, quantidade = 1 } = req.body;

    // validar produto
    const produto = await conn.query(
      `SELECT id FROM produtos WHERE id = ?`,
      [produto_id]
    );

    if (produto.length === 0) {
      return res.status(404).json({ erro: "Produto não encontrado" });
    }

    // pegar carrinho
    const carrinho = await conn.query(
      `SELECT id FROM carrinho WHERE vendedor_id = ?`,
      [vendedor_id]
    );

    if (carrinho.length === 0) {
      return res.status(404).json({ erro: "Carrinho não encontrado" });
    }

    const carrinho_id = carrinho[0].id;

    // verificar se já existe
    const existe = await conn.query(
      `SELECT id, quantidade FROM carrinho_itens 
       WHERE carrinho_id = ? AND produto_id = ?`,
      [carrinho_id, produto_id]
    );

    if (existe.length > 0) {
      // atualiza quantidade
      await conn.query(
        `UPDATE carrinho_itens 
         SET quantidade = quantidade + ?
         WHERE id = ?`,
        [quantidade, existe[0].id]
      );
    } else {
      // insere novo
      await conn.query(
        `INSERT INTO carrinho_itens (carrinho_id, produto_id, quantidade)
         VALUES (?, ?, ?)`,
        [carrinho_id, produto_id, quantidade]
      );
    }

    res.json({ mensagem: "Produto adicionado ao carrinho" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao adicionar item" });
  } finally {
    if (conn) conn.release();
  }
};

// Listar carrinho + total
export const listarCarrinho = async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();
    const vendedor_id = req.user.id;

    const itens = await conn.query(
      `SELECT 
        ci.id,
        ci.produto_id,
        p.nome,
        p.preco,
        ci.quantidade
      FROM carrinho c
      JOIN carrinho_itens ci ON ci.carrinho_id = c.id
      JOIN produtos p ON p.id = ci.produto_id
      WHERE c.vendedor_id = ?`,
      [vendedor_id]
    );

    const total = itens.reduce((acc, item) => {
      return acc + item.preco * item.quantidade;
    }, 0);

    res.json({
      itens,
      total
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao listar carrinho" });
  } finally {
    if (conn) conn.release();
  }
};

// Atualizar quantidade
export const atualizarQuantidade = async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();

    const vendedor_id = req.user.id;
    const { item_id } = req.params;
    const { quantidade } = req.body;

    await conn.query(
      `UPDATE carrinho_itens ci
       JOIN carrinho c ON c.id = ci.carrinho_id
       SET ci.quantidade = ?
       WHERE ci.id = ? AND c.vendedor_id = ?`,
      [quantidade, item_id, vendedor_id]
    );

    res.json({ mensagem: "Quantidade atualizada" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao atualizar quantidade" });
  } finally {
    if (conn) conn.release();
  }
};

// Remover item (seguro)
export const removerItem = async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();

    const vendedor_id = req.user.id;
    const { item_id } = req.params;

    await conn.query(
      `DELETE ci FROM carrinho_itens ci
       JOIN carrinho c ON c.id = ci.carrinho_id
       WHERE ci.id = ? AND c.vendedor_id = ?`,
      [item_id, vendedor_id]
    );

    res.json({ mensagem: "Item removido" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao remover item" });
  } finally {
    if (conn) conn.release();
  }
};

// Limpar carrinho
export const limparCarrinho = async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();

    const vendedor_id = req.user.id;

    await conn.query(
      `DELETE ci FROM carrinho_itens ci
       JOIN carrinho c ON c.id = ci.carrinho_id
       WHERE c.vendedor_id = ?`,
      [vendedor_id]
    );

    res.json({ mensagem: "Carrinho limpo" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao limpar carrinho" });
  } finally {
    if (conn) conn.release();
  }
};