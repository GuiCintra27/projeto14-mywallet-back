import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { users } from "../db/db.js";
import { signInSchema, singUpSchema } from "../models/userSchema.js";

export async function signUpValidation(req, res, next) {
    const { email, password } = req.body;
    const { error } = singUpSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    const user = await users.findOne({ email });

    if (user) {
        return res.status(409).send("User already exists");
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    req.password = passwordHash;

    next();
}

export async function signInValidation(req, res, next) {
    const { email, password } = req.body;
    const token = uuidv4();
    const { error } = signInSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    const user = await users.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
        res.sendStatus(401);
    }

    req.token = token;
    req.userId = user._id;

    next();
}