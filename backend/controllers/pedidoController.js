import pool from "../config/db.js";

// CHECKOUT
export const checkout = async (req, res) => {
  try {
    const usuario_id = req.user.id;

    const itens = await pool.query(
      `SELECT
        ci.produto_id,
        ci.quantidade,
        p.preco
      FROM carrinho_itens ci
      JOIN produtos p
        ON p.id = ci.produto_id
      WHERE ci.usuario_id = ?`,
      [usuario_id]
    );

    if (itens.length === 0) {
      return res.status(400).json({
        erro: "Carrinho vazio"
      });
    }

    let total = 0;

    itens.forEach(item => {
      total += Number(item.preco) * item.quantidade;
    });

    const result = await pool.query(
      `INSERT INTO pedidos
      (cliente_id, total, status)
      VALUES (?, ?, ?)`,
      [usuario_id, total, "pendente"]
    );

    const pedido_id = result.insertId;

    for (const item of itens) {
      await pool.query(
        `INSERT INTO itens_pedido
        (pedido_id, produto_id, quantidade, preco_unitario)
        VALUES (?, ?, ?, ?)`,
        [
          pedido_id,
          item.produto_id,
          item.quantidade,
          item.preco
        ]
      );
    }

    await pool.query(
      `DELETE FROM carrinho_itens
      WHERE usuario_id = ?`,
      [usuario_id]
    );

    res.json({
      mensagem: "Pedido realizado com sucesso",
      pedido_id
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      erro: "Erro ao finalizar pedido"
    });
  }
};

// LISTAR PEDIDOS
export const listarPedidos = async (req, res) => {
  try {
    const cliente_id = req.user.id;

    const pedidos = await pool.query(
      `SELECT *
       FROM pedidos
       WHERE cliente_id = ?
       ORDER BY criado_em DESC`,
      [cliente_id]
    );

    res.json(pedidos);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      erro: "Erro ao listar pedidos"
    });
  }
};

// DETALHAR PEDIDO
export const obterPedidoPorId = async (req, res) => {
  try {
    const cliente_id = req.user.id;

    const pedido = await pool.query(
      `SELECT *
       FROM pedidos
       WHERE id = ?
       AND cliente_id = ?`,
      [
        req.params.id,
        cliente_id
      ]
    );

    if (pedido.length === 0) {
      return res.status(404).json({
        erro: "Pedido não encontrado"
      });
    }

    const itens = await pool.query(
      `SELECT
        ip.id,
        ip.quantidade,
        ip.preco_unitario,
        p.nome
      FROM itens_pedido ip
      JOIN produtos p
        ON p.id = ip.produto_id
      WHERE ip.pedido_id = ?`,
      [req.params.id]
    );

    res.json({
      ...pedido[0],
      itens
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      erro: "Erro ao buscar pedido"
    });
  }
};