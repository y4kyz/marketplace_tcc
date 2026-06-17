import Joi from "joi";

export const produtoSchema = Joi.object({
  nome: Joi.string().min(3).max(100).required(),
  descricao: Joi.string().max(500).allow("").optional(),
  preco: Joi.number().positive().precision(2).required(),
  estoque: Joi.number().integer().min(0).required(),
  categoria_id: Joi.number().integer().required(),
  imagem: Joi.any().optional()
});

export const validarProduto = (req, res, next) => {
  // MUTAÇÃO ESSENCIAL: Converte as strings que o FormData enviou para números puros.
  // Sem isso, o Joi rejeita "100" ou "10" por virem como texto!
  if (req.body.preco) req.body.preco = parseFloat(req.body.preco);
  if (req.body.estoque) req.body.estoque = parseInt(req.body.estoque, 10);
  if (req.body.categoria_id) req.body.categoria_id = parseInt(req.body.categoria_id, 10);

  const { error } = produtoSchema.validate(req.body, {
    allowUnknown: true
  });

  if (error) {
    // Retorna o erro exato do campo para sabermos o que quebrou
    return res.status(400).json({
      erro: `Erro de validação: ${error.details[0].message}`
    });
  }

  next();
};