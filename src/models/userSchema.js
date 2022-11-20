import Joi from "joi";

export const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});

export const singUpSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    password_confirmation: Joi.any().equal(Joi.ref('password'))
        .required()
        .messages({ 'any.only': '{{#label}} does not match' })
});