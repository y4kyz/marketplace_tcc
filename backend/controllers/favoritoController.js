/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Operações de pedidos
 */
import pool from "../config/db.js";

export const adicionarFavorito = async (req, res) => {

  let conn;

  try {

    conn = await pool.getConnection();

    const vendedor_id = req.user.id;
    const { produto_id } = req.body;

    await conn.query(
      `INSERT IGNORE INTO favoritos (vendedor_id, produto_id)
       VALUES (?, ?)`,
      [vendedor_id, produto_id]
    );

    res.json({ mensagem: "Adicionado aos favoritos" });

  } catch (err) {

    console.error(err);
    res.status(500).json({ erro: "Erro ao favoritar" });

  } finally {

    if (conn) conn.release();

  }

};

//remove favorito

export const removerFavorito = async (req, res) => {

  let conn;

  try {

    conn = await pool.getConnection();

    const vendedor_id = req.user.id;
    const { produto_id } = req.params;

    await conn.query(
      `DELETE FROM favoritos 
       WHERE uvendedor_id = ? AND produto_id = ?`,
      [vendedor_id, produto_id]
    );

    res.json({ mensagem: "Removido dos favoritos" });

  } catch (err) {

    console.error(err);
    res.status(500).json({ erro: "Erro ao remover favorito" });

  } finally {

    if (conn) conn.release();

  }

};

//listar os favorito

export const listarFavoritos = async (req, res) => {

  let conn;

  try {

    conn = await pool.getConnection();

    const vendedor_id = req.user.id;

    const favoritos = await conn.query(
      `SELECT 
        p.id,
        p.nome,
        p.preco,
        p.imagem
       FROM favoritos f
       JOIN produtos p ON p.id = f.produto_id
       WHERE f.vendedor_id = ?`,
      [vendedor_id]
    );

    res.json(favoritos);

  } catch (err) {

    console.error(err);
    res.status(500).json({ erro: "Erro ao listar favoritos" });

  } finally {

    if (conn) conn.release();

  }

};