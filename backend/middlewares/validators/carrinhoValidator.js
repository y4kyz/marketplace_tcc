import Joi from "joi";

export const validarAddItem = (req, res, next) => {
  const schema = Joi.object({
    produto_id: Joi.number().integer().required(),
    quantidade: Joi.number().integer().min(1).optional()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ erro: error.details[0].message });
  }

  next();
};

export const validarUpdateItem = (req, res, next) => {
  const schema = Joi.object({
    quantidade: Joi.number().integer().min(1).required()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ erro: error.details[0].message });
  }

  next();
};