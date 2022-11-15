import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient } from "mongodb";
import Joi from "joi";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
mongoClient.connect();
const db = mongoClient.db("my-wallet-db");
const users = db.collection("users");
const sessions = db.collection("sessions");


const app = express();
app.use(express.json());
app.use(cors());

const date = dayjs().format('DD/MM');

const signInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});

const singUpSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    password_confirmation: Joi.any().equal(Joi.ref('password'))
        .required()
        .messages({ 'any.only': '{{#label}} does not match' })
});

const incomingTrasactionSchema = Joi.object({
    value: Joi.number().positive().precision(2).required(),
    description: Joi.string().required()
});

const outgoingTrasactionSchema = Joi.object({
    value: Joi.number().negative().precision(2).required(),
    description: Joi.string().required()
});

app.post('/sign-up', async (req, res) => {
    const { name, email, password } = req.body;
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

    await users.insertOne({ name, email, password: passwordHash, transactions: [] });

    return res.sendStatus(201);
});

app.post('/sign-in', async (req, res) => {
    const { email, password } = req.body;
    const token = uuidv4();
    const { error } = signInSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    const user = await users.findOne({ email });

    if (user && bcrypt.compareSync(password, user.password)) {
        await sessions.insertOne({ token, userId: user._id });
        return res.send({ token });
    }

    return res.sendStatus(401);
});

app.post('/incoming', async (req, res) => {
    const { authorization } = req.headers;
    const { value, description } = req.body;
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
        console.log(authorization)
        return res.sendStatus(401);
    }

    const { error } = incomingTrasactionSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try {
        const session = await sessions.findOne({ token });
        const user = await users.findOne({ _id: session.userId });

        const transaction = await users.updateOne({ _id: user._id }, {
            $set:
            {
                transactions: [
                    ...user.transactions,
                    {
                        type: 'incoming',
                        value,
                        description,
                        date
                    }
                ]
            }
        });

        if (transaction.modifiedCount === 1) {
            return res.sendStatus(200);
        }


        return res.sendStatus(404);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

app.post('/outgoing', async (req, res) => {
    const { authorization } = req.headers;
    const { value, description } = req.body;
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
        console.log(authorization)
        return res.sendStatus(401);
    }

    const { error } = outgoingTrasactionSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }

    try {
        const session = await sessions.findOne({ token });
        const user = await users.findOne({ _id: session.userId });

        const transaction = await users.updateOne({ _id: user._id }, {
            $set:
            {
                transactions: [
                    ...user.transactions,
                    {
                        type: 'outgoing',
                        value,
                        description,
                        date
                    }
                ]
            }
        });

        if (transaction.modifiedCount === 1) {
            return res.sendStatus(200);
        }


        return res.sendStatus(404);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});

app.get(('/'), async (req, res) => {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const session = await sessions.findOne({ token });
        const userData = await users.findOne({ _id: session.userId });

        return res.status(200).send(userData);
    } catch (error) {
        console.log(error);
        return res.sendStatus(404);
    }
})

app.listen(5000, () => {
    console.log('Server is running on port: 5000');
});