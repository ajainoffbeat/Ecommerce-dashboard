import express from "express";
import { connectToDatabase } from "./config/db";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRouter } from "./route/authRouter";
import { categoryRouter } from "./route/categoryRouter";


const PORT = 3000;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], 
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/v1/", authRouter);
app.use("/api/v1/category", categoryRouter)


connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error: any) => {
    console.error(
      "Failed to connect to the database. Server not started.",
      error
    );
  });
