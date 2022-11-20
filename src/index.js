import express from "express";
import cors from "cors";
import router from "./routes/routes.js";

const port = 5000;
const app = express();
app.use(express.json());
app.use(cors());
app.use(router);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});