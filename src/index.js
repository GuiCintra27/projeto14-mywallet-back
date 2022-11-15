import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient } from "mongodb";
import Joi from "joi";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
dotenv.config()

const mongoClient = new MongoClient(process.env.MONGO_URI);
mongoClient.connect();
const db = mongoClient.db("my-wallet-db");

const app = express();
app.use(express.json());
app.use(cors());

const date = dayjs().format('DD/MM');

const logInSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required() 
});

const singInSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    password_confirmation: Joi.any().valid(Joi.ref('password')).required().options({ language: { any: { allowOnly: 'must match password' } } })
});

const incomingTrasactionSchema = Joi.object({
    value: Joi.number().positive().precision(2).required(),
    description: Joi.string().required()
});

const outgoingTrasactionSchema = Joi.object({
    value: Joi.number().negative().precision(2).required(),
    description: Joi.string().required()
});