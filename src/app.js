import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import shortenUrlRoutes from "./routes/shortenUrlRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use([authRoutes, shortenUrlRoutes]);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Servidor funfando na porta: ${PORT}`));
