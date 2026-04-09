const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.getAll();
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.getById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

exports.createTask = async (req, res) => {
  const { title, description, dueDate, category } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Validation Error: Title cannot be empty' });
  }
  
  try {
    const newTask = await Task.create({ title, description, dueDate, category });
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

exports.updateTask = async (req, res) => {
  const { title, description, dueDate, category } = req.body;
  
  if (title !== undefined && title.trim() === '') {
    return res.status(400).json({ error: 'Validation Error: Title cannot be empty' });
  }

  try {
    const updatedTask = await Task.update(req.params.id, { title, description, dueDate, category });
    if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
    
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

exports.completeTask = async (req, res) => {
  try {
    const task = await Task.getById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    if (task.completed) {
      return res.status(400).json({ error: 'Validation Error: Task is already marked as completed' });
    }
    
    const updatedTask = await Task.update(req.params.id, { completed: true });
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to complete task' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const deleted = await Task.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Task not found' });
    
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
