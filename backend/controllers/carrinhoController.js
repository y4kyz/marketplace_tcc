import pool from '../config/db.js';

export const criarCarrinho = async (req, res) => {

  let conn;

  try {

    conn = await pool.getConnection();
    const usuario_id = req.user.id;

    const [existente] = await conn.query(
      `SELECT id FROM carrinho WHERE usuario_id = ?`,
      [usuario_id]
    );

    if (existente.length > 0) {
      return res.json({
        mensagem: "Carrinho já existe",
        carrinho_id: existente[0].id
      });
    }

    const result = await conn.query(
      `INSERT INTO carrinho (usuario_id) VALUES (?)`,
      [usuario_id]
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

//adiciona no carrin

export const adicionarItem = async (req, res) => {

    let conn;
  
    try {
  
      conn = await pool.getConnection();
  
      const usuario_id = req.user.id;
      const { produto_id, quantidade = 1 } = req.body;
  
      const [carrinho] = await conn.query(
        `SELECT id FROM carrinho WHERE usuario_id = ?`,
        [usuario_id]
      );
  
      if (carrinho.length === 0) {
        return res.status(404).json({ erro: "Carrinho não encontrado" });
      }
  
      const carrinho_id = carrinho[0].id;
  
      await conn.query(
        `INSERT INTO carrinho_itens (carrinho_id, produto_id, quantidade)
         VALUES (?, ?, ?)`,
        [carrinho_id, produto_id, quantidade]
      );
  
      res.json({ mensagem: "Produto adicionado ao carrinho" });
  
    } catch (err) {
  
      console.error(err);
      res.status(500).json({ erro: "Erro ao adicionar item" });
  
    } finally {
  
      if (conn) conn.release();
  
    }
  
  };

  //lista produtos

  export const listarCarrinho = async (req, res) => {

    let conn;
  
    try {
  
      conn = await pool.getConnection();
      const usuario_id = req.user.id;
  
      const [itens] = await conn.query(
        `SELECT 
          ci.id,
          p.nome,
          p.preco,
          ci.quantidade
        FROM carrinho c
        JOIN carrinho_itens ci ON ci.carrinho_id = c.id
        JOIN produtos p ON p.id = ci.produto_id
        WHERE c.usuario_id = ?`,
        [usuario_id]
      );
  
      res.json(itens);
  
    } catch (err) {
  
      console.error(err);
      res.status(500).json({ erro: "Erro ao listar carrinho" });
  
    } finally {
  
      if (conn) conn.release();
  
    }
  
  };

  //remove produtos

  export const removerItem = async (req, res) => {

    let conn;
  
    try {
  
      conn = await pool.getConnection();
      const { item_id } = req.params;
  
      await conn.query(
        `DELETE FROM carrinho_itens WHERE id = ?`,
        [item_id]
      );
  
      res.json({ mensagem: "Item removido" });
  
    } catch (err) {
  
      console.error(err);
      res.status(500).json({ erro: "Erro ao remover item" });
  
    } finally {
  
      if (conn) conn.release();
  
    }
  
  };

  