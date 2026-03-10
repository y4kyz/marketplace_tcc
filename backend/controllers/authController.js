import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {

  try {

    const { nome, email, senha, tipo } = req.body;

    const senhaHash = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      `INSERT INTO usuarios (nome,email,senha,tipo)
       VALUES (?,?,?,?)`,
      [nome, email, senhaHash, tipo]
    );

    res.status(201).json({
      mensagem: "Usuário criado",
      id: result.insertId
    });

  } catch (erro) {

    res.status(500).json({ erro: erro.message });

  }

};


export const login = async (req, res) => {

  try {

    const { email, senha } = req.body;

    const user = await pool.query(
      `SELECT * FROM usuarios WHERE email = ?`,
      [email]
    );

    if (user.length === 0) {
      return res.status(401).json({ erro: "Usuário não encontrado" });
    }

    const usuario = user[0];

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: "Senha inválida" });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        tipo: usuario.tipo
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      mensagem: "Login realizado",
      token
    });

  } catch (erro) {

    res.status(500).json({ erro: erro.message });

  }

};