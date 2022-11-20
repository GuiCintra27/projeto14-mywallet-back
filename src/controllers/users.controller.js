import { users, sessions } from "../db/db.js";

export async function signUp(req, res) {
    const { name, email } = req.body;
    const password = req.password;

    await users.insertOne({ name, email, password, transactions: [] });

    return res.sendStatus(201);
};

export async function signIn(req, res) {
    const token = req.token;
    const userId = req.userId;

    await sessions.insertOne({ token, userId });
    
    return res.send({ token });
};