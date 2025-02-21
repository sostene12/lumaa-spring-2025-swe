import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./database/connectDb";

import userRouter from "./routes/userRoute";
import taskRouter from "./routes/taskRouter";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDb();
});


app.use("/auth", userRouter);
app.use("/tasks", taskRouter);
