import dayjs from "dayjs";
import { users } from "../db/db.js";

const date = dayjs().format('DD/MM');

export async function incomingTransaction(req, res) {
    const { value, description } = req.body;
    const user = req.user;

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
}

export async function outgoingTransaction(req, res) {
    const { value, description } = req.body;
    const user = req.user;

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
}

export async function getTransactions(req, res) {
    const user = req.user;
    
    return res.status(200).send(user);
}