/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: Operações de pedidos
 */
import pool from "../config/db.js";

export const criarAvaliacao = async (req, res) => {

  let conn;

  try {

    conn = await pool.getConnection();

    const vendedor_id = req.user.id;
    const { produto_id, nota, comentario } = req.body;

    if (nota < 1 || nota > 5) {
      return res.status(400).json({ erro: "Nota deve ser entre 1 e 5" });
    }

    await conn.query(
      `INSERT INTO avaliacoes
      (vendedor_id, produto_id, nota, comentario)
      VALUES (?, ?, ?, ?)`,
      [vendedor_id, produto_id, nota, comentario]
    );

    res.json({ mensagem: "Avaliação registrada" });

  } catch (err) {

    console.error(err);
    res.status(500).json({ erro: "Erro ao registrar avaliação" });

  } finally {

    if (conn) conn.release();

  }

};

//lista avaliuações

export const listarAvaliacoesProduto = async (req, res) => {

  let conn;

  try {

    conn = await pool.getConnection();

    const { produto_id } = req.params;

    const avaliacoes = await conn.query(
      `SELECT 
        a.nota,
        a.comentario,
        a.criado_em,
        u.nome
       FROM avaliacoes a
       JOIN usuarios u ON u.id = a.vendedor_id
       WHERE a.produto_id = ?
       ORDER BY a.criado_em DESC`,
      [produto_id]
    );

    res.json(avaliacoes);

  } catch (err) {

    console.error(err);
    res.status(500).json({ erro: "Erro ao buscar avaliações" });

  } finally {

    if (conn) conn.release();

  }

};

//média avaliações

export const mediaAvaliacoesProduto = async (req, res) => {

  let conn;

  try {

    conn = await pool.getConnection();

    const { produto_id } = req.params;

    const resultado = await conn.query(
      `SELECT 
        AVG(nota) AS media,
        COUNT(*) AS total
       FROM avaliacoes
       WHERE produto_id = ?`,
      [produto_id]
    );

    res.json({
      media: resultado.media || 0,
      total: resultado.total || 0
    });

  } catch (err) {

    console.error(err);
    res.status(500).json({ erro: "Erro ao calcular média" });

  } finally {

    if (conn) conn.release();

  }

};