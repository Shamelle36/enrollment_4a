import express from "express";
import enrollmentRoutes from "./routes/enrollment.routes.js";

const app = express();

app.use(express.json());

app.use("/api", enrollmentRoutes);

export default app;
