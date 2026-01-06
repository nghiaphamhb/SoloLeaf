import express from "express";
import cors from "cors";
import morgan from "morgan";
import searchRouter from "./routes/search.js";
import dotenv from "dotenv";
dotenv.config({ path: "../../.env" });

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/search", searchRouter);

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
    console.log(`nodejs-microservices listening on :${port}`);
});
