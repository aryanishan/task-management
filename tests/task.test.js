const request = require('supertest');
const app = require('../src/app');

describe('Task API', () => {
  let createdTaskId;

  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({
        title: 'Interview Practical',
        description: 'Complete the Node.js test',
        dueDate: '2026-04-10',
        category: 'Interview'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toEqual('Interview Practical');
    expect(res.body.completed).toEqual(false);
    createdTaskId = res.body.id;
  });

  it('should not create a task without a title', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({
        description: 'No title provided'
      });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should fetch all tasks', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should fetch a single task by id', async () => {
    const res = await request(app).get(`/api/tasks/${createdTaskId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(createdTaskId);
  });

  it('should update a task', async () => {
    const res = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .send({
        title: 'Updated Interview Practical'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toEqual('Updated Interview Practical');
  });

  it('should update a task validation check', async () => {
    const res = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .send({
        title: '   '
      });
    expect(res.statusCode).toEqual(400);
  });

  it('should complete a task', async () => {
    const res = await request(app).patch(`/api/tasks/${createdTaskId}/complete`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.completed).toEqual(true);
  });

  it('should not complete an already completed task', async () => {
    const res = await request(app).patch(`/api/tasks/${createdTaskId}/complete`);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should delete a task', async () => {
    const res = await request(app).delete(`/api/tasks/${createdTaskId}`);
    expect(res.statusCode).toEqual(204);
  });
  
  it('should return 404 for deleted task', async () => {
    const res = await request(app).get(`/api/tasks/${createdTaskId}`);
    expect(res.statusCode).toEqual(404);
  });
});
