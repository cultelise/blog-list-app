const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const User = require('../models/user');
// const listHelper = require('../utils/list_helper');
const helper = require('./test_helper');

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  await helper.postToDb();
});

test('right # of blogs', async () => {
  const blogs = await api.get('/api/blogs');
  expect(blogs.body).toHaveLength(3);
});

test('id', async () => {
  const blogs = await helper.blogsInDb();
  expect(blogs[0].id).toBeDefined();
});

describe('post tests', () => {
  
  test('post works', async () => {
    const login = await helper.makeTestUser();

    const blog = JSON.stringify({
      title: 'Test Blog',
      author: 'Joe',
      url: '1.com',
    });

    await api
      .post('/api/blogs')
      .send(blog)
      .set('Content-Type', 'application/json')
      .set('Authorization', `bearer ${login.body.token}`)
      .expect(201);
    // .expect('Content-Type', /application\/json/);

    const fetchedBlogs = await helper.blogsInDb();

    expect(fetchedBlogs).toHaveLength(4);
  });

  test('likes defaults to 0', async () => {
    const login = await helper.makeTestUser();

    const blog = JSON.stringify({
      title: 'Best Tlog',
      author: 'Eoj',
      url: '12.com',
    });

    await api
      .post('/api/blogs')
      .send(blog)
      .set('Content-Type', 'application/json')
      .set('Authorization', `bearer ${login.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const fetchedBlogs = await helper.blogsInDb();

    expect(fetchedBlogs[3].likes).toBe(0);
  });

  test('no title/url returns 400', async () => {
    const login = await helper.makeTestUser();

    const blog = JSON.stringify({
      author: 'No Url',
      title: 'Test',
    });

    await api
      .post('/api/blogs')
      .send(blog)
      .set('Content-Type', 'application/json')
      .set('Authorization', `bearer ${login.body.token}`).expect(400);

    const fetchedBlogs = await helper.blogsInDb();
    expect(fetchedBlogs).toHaveLength(3);
  });
});

// test('put works', async () => {
//   const blogsAtStart = await helper.blogsInDb();
//   const blogToUpdate = blogsAtStart[0];

//   const newBlog = new Blog({
//     title: blogToUpdate.title,
//     author: blogToUpdate.author,
//     url: blogToUpdate.url,
//     likes: 54,
//   });

//   const updatedBlog = await api.put(`/api/blogs/${blogToUpdate.id}`, newBlog);

//   const blogsEnd = await helper.blogsInDb();

//   expect(updatedBlog.body.likes).toBe(54);
// });

test('X', async () => {
  const blogsAtStart = await helper.blogsInDb();
  const blogToDelete = blogsAtStart[0];

  await api.delete(`/api/blogs/${blogToDelete.id}`);
  const blogsEnd = await helper.blogsInDb();
  expect(blogsEnd).toHaveLength(3);
});

afterAll(() => {
  mongoose.connection.close();
});
