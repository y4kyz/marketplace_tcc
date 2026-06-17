import pool from "../config/db.js";

// ADICIONAR ITEM
export const adicionarItem = async (req, res) => {
  try {
    const usuario_id = req.user.id;
    const { produto_id, quantidade = 1 } = req.body;

    const existente = await pool.query(
      `SELECT * FROM carrinho_itens
       WHERE usuario_id = ? AND produto_id = ?`,
      [usuario_id, produto_id]
    );

    if (existente.length > 0) {
      await pool.query(
        `UPDATE carrinho_itens
         SET quantidade = quantidade + ?
         WHERE usuario_id = ? AND produto_id = ?`,
        [quantidade, usuario_id, produto_id]
      );

      return res.json({
        mensagem: "Quantidade atualizada no carrinho"
      });
    }

    await pool.query(
      `INSERT INTO carrinho_itens
       (usuario_id, produto_id, quantidade)
       VALUES (?, ?, ?)`,
      [usuario_id, produto_id, quantidade]
    );

    res.status(201).json({
      mensagem: "Produto adicionado ao carrinho"
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      erro: "Erro ao adicionar item"
    });
  }
};

// LISTAR CARRINHO
export const listarCarrinho = async (req, res) => {
  try {
    const usuario_id = req.user.id;

const itens = await pool.query(
  `SELECT
    ci.id,
    p.id AS produto_id,
    p.nome,
    p.preco,
    p.imagem,
    ci.quantidade,
    (p.preco * ci.quantidade) AS subtotal
  FROM carrinho_itens ci
  JOIN produtos p
    ON p.id = ci.produto_id
  WHERE ci.usuario_id = ?`,
  [usuario_id]
);

    const total = itens.reduce(
      (acc, item) => acc + Number(item.subtotal),
      0
    );

    res.json({
      itens,
      total
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      erro: "Erro ao listar carrinho"
    });
  }
};

// ATUALIZAR QUANTIDADE
export const atualizarQuantidade = async (req, res) => {
  try {
    const usuario_id = req.user.id;

    const { item_id } = req.params;
    const { quantidade } = req.body;

    await pool.query(
      `UPDATE carrinho_itens
       SET quantidade = ?
       WHERE id = ? AND usuario_id = ?`,
      [quantidade, item_id, usuario_id]
    );

    res.json({
      mensagem: "Quantidade atualizada"
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      erro: "Erro ao atualizar quantidade"
    });
  }
};

// REMOVER ITEM
export const removerItem = async (req, res) => {
  try {
    const usuario_id = req.user.id;

    const { item_id } = req.params;

    await pool.query(
      `DELETE FROM carrinho_itens
       WHERE id = ? AND usuario_id = ?`,
      [item_id, usuario_id]
    );

    res.json({
      mensagem: "Item removido"
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      erro: "Erro ao remover item"
    });
  }
};

// LIMPAR CARRINHO
export const limparCarrinho = async (req, res) => {
  try {
    const usuario_id = req.user.id;

    await pool.query(
      `DELETE FROM carrinho_itens
       WHERE usuario_id = ?`,
      [usuario_id]
    );

    res.json({
      mensagem: "Carrinho limpo"
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      erro: "Erro ao limpar carrinho"
    });
  }
};