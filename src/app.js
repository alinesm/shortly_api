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

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Servidor funfando na porta: ${port}`));
