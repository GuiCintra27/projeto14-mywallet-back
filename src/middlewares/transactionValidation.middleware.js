import { users, sessions } from "../db/db.js";
import trasactionSchema from "../models/transactionSchema.js";

export default async function validateTransaction(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
        return res.sendStatus(401);
    }

    const { error } = trasactionSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    const session = await sessions.findOne({ token });

    if (!session) {
        return res.sendStatus(404);
    }

    const user = await users.findOne({ _id: session.userId });

    if (!user) {
        return res.sendStatus(404);
    }

    req.session = session;
    req.user = user;

    next();
}