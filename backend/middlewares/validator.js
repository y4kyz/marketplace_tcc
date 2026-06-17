const Joi = require('joi');

const produtoSchema = Joi.object({
    nome: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'O nome do produto é obrigatório',
        'string.min': 'O nome deve ter pelo menos 3 caracteres'
    }),
    preco: Joi.number().positive().required().messages({
        'number.positive': 'O preço deve ser um valor maior que zero'
    }),
    descricao: Joi.string().allow('', null), // opcional
    estoque: Joi.number().integer().min(0).default(0)
});

// Middleware genérico para validar
const validarProduto = (req, res, next) => {
    const { error } = produtoSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ erro: error.details[0].message });
    }
    next(); // Se estiver tudo certo, vai para o Controller
};

module.exports = { validarProduto };