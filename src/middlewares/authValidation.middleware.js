import { users, sessions } from "../db/db.js";

export default async function authValidation(req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
        return res.sendStatus(401);
    }

    const session = await sessions.findOne({ token });
    
    if (!session) {
        return res.sendStatus(404);
    }
    
    const user = await users.findOne({ _id: session.userId });
    
    if (!user) {
        return res.sendStatus(404);
    }
    
    req.token = token;
    req.session = session;
    req.user = user;

    next();
}