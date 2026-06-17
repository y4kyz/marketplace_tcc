import { produtoSchema } from "../validators/produtoValidator.js";

export const validarProduto = (req, res, next) => {
  const { error } = produtoSchema.validate(req.body, {
    abortEarly: false
  });

  if (error) {
    return res.status(400).json({
      erros: error.details.map(err => err.message)
    });
  }

  next();
};