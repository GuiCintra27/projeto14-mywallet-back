import Joi from "joi";

const trasactionSchema = Joi.object({
    value: Joi.number().required(),
    description: Joi.string().required()
});

export default trasactionSchema;