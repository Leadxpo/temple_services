const { sequelize } = require('../db');
const TaskModel = require('../Models/Task')(sequelize);
const UserModel = require('../Models/SystemUser')(sequelize);
const { Op } = require("sequelize");
const express = require('express');
const router = express.Router();
const { successResponse, errorResponse } = require("../Midileware/response");
const { userAuth } = require("../Midileware/Auth");

// Create Task
router.post("/create", userAuth, async (req, res) => {
  try {
    const task = await TaskModel.create(req.body);
    return successResponse(res, "Task created successfully", task);
  } catch (error) {
    return errorResponse(res, "Error creating task", error);
  }
});

// Update Task
router.patch("/update/:id", userAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await TaskModel.update(req.body, { where: { id } });
    return successResponse(res, "Task updated successfully", updatedTask);
  } catch (error) {
    return errorResponse(res, "Error updating task", error);
  }
});

// Delete Task
router.delete("/delete/:id", userAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await TaskModel.destroy({ where: { id } });
    return successResponse(res, "Task deleted successfully");
  } catch (error) {
    return errorResponse(res, "Error deleting task", error);
  }
});

// Get Task by ID
router.get("/get/:taskId", userAuth, async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await TaskModel.findByPk(taskId);
    return successResponse(res, "Task fetched successfully", task);
  } catch (error) {
    return errorResponse(res, "Error fetching task", error);
  }
});

// Get All Tasks
router.get("/get-all", userAuth, async (req, res) => {
  try {
    const tasks = await TaskModel.findAll();
    return successResponse(res, "All tasks fetched successfully", tasks);
  } catch (error) {
    return errorResponse(res, "Error fetching tasks", error);
  }
});

// Search Task by Name
router.get("/search", userAuth, async (req, res) => {
  try {
    const { name } = req.query;
    const tasks = await TaskModel.findAll({ where: { name: { [Op.like]: `%${name}%` } } });
    return successResponse(res, "Tasks found successfully", tasks);
  } catch (error) {
    return errorResponse(res, "Error searching tasks", error);
  }
});

// Count Tasks
router.get("/count", userAuth, async (req, res) => {
  try {
    const count = await TaskModel.count();
    return successResponse(res, "Task count fetched successfully", { count });
  } catch (error) {
    return errorResponse(res, "Error counting tasks", error);
  }
});

// Task Page with User Reference
router.get("/task-with-user", userAuth, async (req, res) => {
  try {
    const tasks = await TaskModel.findAll({
      include: [{ model: UserModel, attributes: ['id', 'email', 'firstName'] }]
    });
    return successResponse(res, "Tasks with user reference fetched successfully", tasks);
  } catch (error) {
    return errorResponse(res, "Error fetching tasks with user reference", error);
  }
});

module.exports = router;
