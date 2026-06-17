import pool from "../config/db.js";

export const pedidosDoVendedor = async (req, res) => {

  let conn;

  try {

    conn = await pool.getConnection();

    const vendedor_id = req.user.id;

    const pedidos = await conn.query(
      `SELECT 
        p.id AS pedido_id,
        p.criado_em,
        pi.quantidade,
        pi.preco,
        pr.nome AS produto
       FROM pedido_itens pi
       JOIN pedidos p ON p.id = pi.pedido_id
       JOIN produtos pr ON pr.id = pi.produto_id
       WHERE pr.vendedor_id = ?
       ORDER BY p.criado_em DESC`,
      [vendedor_id]
    );

    res.json(pedidos);

  } catch (err) {

    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar pedidos do vendedor" });

  } finally {

    if (conn) conn.release();

  }

};

export const dashboardVendedor = async (req, res) => {

  let conn;

  try {

    conn = await pool.getConnection();

    const vendedor_id = req.user.id;

    const vendas = await conn.query(
      `SELECT COUNT(DISTINCT pedido_id) AS total_pedidos
       FROM pedido_itens pi
       JOIN produtos pr ON pr.id = pi.produto_id
       WHERE pr.vendedor_id = ?`,
      [vendedor_id]
    );

    const faturamento = await conn.query(
      `SELECT SUM(pi.preco * pi.quantidade) AS total
       FROM pedido_itens pi
       JOIN produtos pr ON pr.id = pi.produto_id
       WHERE pr.vendedor_id = ?`,
      [vendedor_id]
    );

    const produtos = await conn.query(
      `SELECT COUNT(*) AS total_produtos
       FROM produtos
       WHERE vendedor_id = ? AND ativo = 1`,
      [vendedor_id]
    );

    res.json({
      totalPedidos: vendas.total_pedidos || 0,
      faturamento: faturamento.total || 0,
      totalProdutos: produtos.total_produtos || 0
    });

  } catch (err) {

    console.error(err);
    res.status(500).json({ erro: "Erro ao carregar dashboard" });

  } finally {

    if (conn) conn.release();

  }

};

export const perfilVendedor = async (req, res) => {

  let conn;

  try {

    conn = await pool.getConnection();

    const vendedor_id = req.params.id;

    const usuario = await conn.query(
      `SELECT id, nome, email, foto_perfil, criado_em
       FROM usuarios
       WHERE id = ?`,
      [vendedor_id]
    );

    if (!usuario) {
      return res.status(404).json({ erro: "Vendedor não encontrado" });
    }

    res.json(usuario);

  } catch (err) {

    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar perfil" });

  } finally {

    if (conn) conn.release();

  }

};

export const produtosDoVendedor = async (req, res) => {

  let conn;

  try {

    conn = await pool.getConnection();

    const vendedor_id = req.params.id;

    const produtos = await conn.query(
      `SELECT 
        id,
        nome,
        preco,
        estoque,
        imagem
       FROM produtos
       WHERE vendedor_id = ? AND ativo = 1`,
      [vendedor_id]
    );

    res.json(produtos);

  } catch (err) {

    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar produtos do vendedor" });

  } finally {

    if (conn) conn.release();

  }

};