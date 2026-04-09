const { getDbConnection } = require('../config/db');

class Task {
  static async getAll() {
    const db = await getDbConnection();
    const tasks = await db.all('SELECT * FROM tasks');
    return tasks.map(t => ({ ...t, completed: Boolean(t.completed) }));
  }

  static async getById(id) {
    const db = await getDbConnection();
    const task = await db.get('SELECT * FROM tasks WHERE id = ?', [id]);
    if (!task) return null;
    return { ...task, completed: Boolean(task.completed) };
  }

  static async create({ title, description, dueDate, category }) {
    const db = await getDbConnection();
    const result = await db.run(
      'INSERT INTO tasks (title, description, dueDate, category) VALUES (?, ?, ?, ?)',
      [title, description || null, dueDate || null, category || null]
    );
    return await this.getById(result.lastID);
  }

  static async update(id, { title, description, completed, dueDate, category }) {
    const db = await getDbConnection();
    const task = await this.getById(id);
    if (!task) return null;
    
    // Convert boolean to integer for SQLite if provided
    const completedVal = completed !== undefined ? (completed ? 1 : 0) : undefined;
    
    await db.run(
      `UPDATE tasks SET 
        title = COALESCE(?, title),
        description = COALESCE(?, description),
        completed = COALESCE(?, completed),
        dueDate = COALESCE(?, dueDate),
        category = COALESCE(?, category)
      WHERE id = ?`,
      [title, description, completedVal, dueDate, category, id]
    );
    return await this.getById(id);
  }

  static async delete(id) {
    const db = await getDbConnection();
    const result = await db.run('DELETE FROM tasks WHERE id = ?', [id]);
    return result.changes > 0;
  }
}

module.exports = Task;
