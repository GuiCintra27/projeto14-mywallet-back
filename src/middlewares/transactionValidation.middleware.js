import trasactionSchema from "../models/transactionSchema.js";

export default async function validateTransaction(req, res, next) {
    const { error } = trasactionSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    next();
}