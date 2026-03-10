import jwt from 'jsonwebtoken';

export const autenticarToken = (req, res, next) => {

  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

    if (err) {
      return res.status(403).json({ erro: 'Token inválido' });
    }

    req.user = user;

    next();

  });

};


export const apenasVendedor = (req, res, next) => {

  if (req.user.tipo !== 'vendedor') {
    return res.status(403).json({ erro: 'Apenas vendedores podem fazer isso' });
  }

  next();

};

const authMiddleware = (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = decoded;

    next();

  } catch (err) {

    return res.status(401).json({ erro: "Token inválido" });

  }

};

export default authMiddleware;