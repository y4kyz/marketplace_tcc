import Joi from "joi";

export const validarRegistro = (req, res, next) => {
  const schema = Joi.object({
    nome: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    senha: Joi.string().min(6).required(),
    tipo: Joi.string().valid("cliente", "vendedor").required()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ erro: error.details[0].message });
  }

  next();
};

export const validarLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    senha: Joi.string().required()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(400).json({ erro: error.details[0].message });
  }

  next();
};