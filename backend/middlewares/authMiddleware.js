import jwt from 'jsonwebtoken';

export const autenticarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  // CORREÇÃO: Mesma chave de fallback utilizada no authController para não dar "Token Inválido"
  const chaveSecreta = process.env.JWT_SECRET || "Wgvjv9GSGHFh4ZP3QIYdMl4kyzdev";

  jwt.verify(token, chaveSecreta, (err, user) => {
    if (err) {
      console.error("Erro na verificação do JWT:", err.message);
      return res.status(403).json({ erro: 'Token inválido' });
    }

    req.user = user;
    next();
  });
};

export const apenasVendedor = (req, res, next) => {
  // CORREÇÃO: Garante que mesmo que venha "Vendedor" ou com espaços, a validação aceite
  if (!req.user || !req.user.tipo || String(req.user.tipo).trim().toLowerCase() !== 'vendedor') {
    return res.status(403).json({ erro: 'Apenas vendedores podem fazer isso' });
  }

  next();
};