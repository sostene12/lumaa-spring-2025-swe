import express from "express";
import { verifyToken } from "../middlewares/verifyToken";

import TaskController from "../controllers/taskController";

const taskRouter = express.Router();

taskRouter.get("/", verifyToken, TaskController.getALlTasks);
taskRouter.post("/", verifyToken, TaskController.createTask);
taskRouter.put("/:id", verifyToken, TaskController.updateTask);
taskRouter.delete("/:id", verifyToken, TaskController.deleteTask);

export default taskRouter;
