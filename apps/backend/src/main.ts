import express from "express";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth";
import { accountRouter } from "./routes/account";

dotenv.config();

const app = express();

const PORT = process.env.PORT;

app.listen(PORT, () => console.log("listening on port " + PORT));

app.use("", authRouter);
app.use("/account", accountRouter);
