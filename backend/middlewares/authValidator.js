import Joi from "joi";

export const registerSchema = Joi.object({
  nome: Joi.string().min(3).max(100).required(),

  email: Joi.string().email().required(),

  senha: Joi.string().min(6).required(),

  tipo: Joi.string()
    .valid("cliente", "vendedor")
    .required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),

  senha: Joi.string().required()
});

export const validarRegistro = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      mensagem: error.details[0].message
    });
  }

  next();
};

export const validarLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      mensagem: error.details[0].message
    });
  }

  next();
};