import { where } from "sequelize";
import models from "../database/models";

const { Task, User } = models;

class TaskController {
  static async getALlTasks(req, res) {
    try {
      const tasks = await Task.findAll({
        include: {
          model: User,
          attributes: { exclude: ["password", "createdAt", "updatedAt", "id"] },
        },
      });
      res.status(200).json({ status: "success", data: tasks });
    } catch (error) {
      res.status(500).json({ status: "error", error: error.message });
    }
  }
  static async createTask(req, res) {
    try {
      const { title, description } = req.body;
      const userId = req.user.id;
      const newTask = await Task.create({
        title,
        description,
        userId,
      });

      return res.status(201).json({
        message: "Task created successfully",
        newTask,
      });
    } catch (error) {
      res.status(500).json({ status: "error", error: error.message });
    }
  }

  static async updateTask(req, res) {
    try {
      const userId = req.user.id;
      const taskId = req.params.id;
      const { title, description, isComplete } = req.body;
      const task = await Task.findOne({ where: { id: taskId, userId } });
      if (!task) {
        return res
          .status(404)
          .json({ status: "error", error: "Task not found" });
      }

      await task.update({ title, description, isComplete });
      return res.status(200).json({
        status: "success",
        message: "Task updated successfully",
        task,
      });
    } catch (error) {
      res.status(500).json({ status: "error", error: error.message });
    }
  }

  static async deleteTask(req, res) {
    try {
      const userId = req.user.id;
      const taskId = req.params.id;
      const task = await Task.findOne({ where: { id: taskId, userId } });
      if (!task) {
        return res
          .status(404)
          .json({ status: "error", error: "Task not found" });
      }

      await Task.destroy({ where: { id: taskId } });
      return res.status(200).json({
        status: "success",
        message: "Task deleted successfully",
      });
    } catch (error) {
      res.status(500).json({ status: "error", error: error.message });
    }
  }
}

export default TaskController;
