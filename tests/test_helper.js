const Blog = require('../models/blog');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

const initialBlogs = [
  {
    title: 'Hello, Elise',
    author: 'Cult',
    url: 'everywhere.com',
  },
  {
    title: 'Hell, Cult',
    author: 'Elise',
    url: 'nowhere.com',
  },
  {
    title: 'Note to Delete',
    author: 'Elise',
    url: '0.com'
  }
];


const blogsInDb = async () => {
  const blogs = await Blog.find({});

  return blogs.map((blog) => {
    return blog.toJSON();
  });
};

const postToDb = async () => {
  await Promise.all(
    initialBlogs.map(async (blog) => {
      const blogObject = new Blog(blog);
      await blogObject.save();
    })
  );
};

const makeTestUser = async ()=> {
  const user = JSON.stringify({
    username: 'testo',
    name: 'testo',
    password: 'testo'
  });

  const createdUser = await api
    .post('/api/users')
    .send(user)
    .set('Content-Type', 'application/json');

  console.log('CREATED USER:  ', createdUser.body);

  const logInfo = JSON.stringify({
    username: 'testo',
    password: 'testo'
  });

  const login = await api.post('/api/login')
    .send(logInfo)
    .set('Content-Type', 'application/json');

  console.log(login.body);

  return login;
};

module.exports = {
  initialBlogs,
  blogsInDb,
  postToDb,
  makeTestUser
};
