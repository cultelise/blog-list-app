const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
// const Blog = require('../models/blog');
// const listHelper = require('../utils/list_helper');
const helper = require('./test_helper');

test('right # of blogs', async () => {
  const blogs = await api.get('/api/blogs');
  expect(blogs.body).toHaveLength(2);
});

test('id', async () => {
  const blogs = await helper.blogsInDb();
  expect(blogs[0].id).toBeDefined();
});

afterAll(() => {
  mongoose.connection.close();
});