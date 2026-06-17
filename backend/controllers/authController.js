import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { nome, email, senha, tipo } = req.body;

    const existente = await pool.query(
      `SELECT id FROM usuarios WHERE email = ?`,
      [email]
    );

    if (existente.length > 0) {
      return res.status(400).json({ erro: "Email já cadastrado" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const result = await pool.query(
      `INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)`,
      [nome, email, senhaHash, tipo]
    );

    res.status(201).json({
      mensagem: "Usuário criado com sucesso",
      id: result.insertId
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao registrar usuário" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const rows = await pool.query(
      `SELECT * FROM usuarios WHERE email = ?`,
      [email]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).json({ erro: "Usuário não encontrado" });
    }

    const usuario = JSON.parse(JSON.stringify(rows[0]));
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ erro: "Senha inválida" });
    }

    const payload = {
      id: Number(usuario.id),
      tipo: String(usuario.tipo).trim().toLowerCase()
    };

    const chaveSecreta = process.env.JWT_SECRET || "Wgvjv9GSGHFh4ZP3QIYdMl4kyzdev";

    const token = jwt.sign(payload, chaveSecreta, { expiresIn: "1d" });

    res.json({
      mensagem: "Login realizado com sucesso",
      token,
      usuario: {
        id: payload.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: payload.tipo
      }
    });

  } catch (erro) {
    console.error("Erro interno no login:", erro);
    res.status(500).json({ erro: "Erro ao realizar login" });
  }
};