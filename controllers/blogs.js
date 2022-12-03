const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const { info } = require('../utils/logger');

const Blog = require('../models/blog');
const User = require('../models/user');


blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  });
  res.json(blogs);
});

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  res.json(blog);
});

blogsRouter.post('/', async (req, res) => {
  const body = req.body;
  info('req.token:', req.token);
  const decodedToken = jwt.verify(req.token, config.SECRET);

  if (!decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);

  info('userid: ', user._id);
  info('decodedToken id: ', decodedToken.id);

  if (!body.title || !body.url) {
    return res.status(400).json({ error: 'title and url required' });
  }

  if (user.id !== decodedToken.id) {
    return res.status(401).json({ error: 'token does not match user' });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  res.status(201).json(savedBlog);
});

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body;
  console.log('New Request. req body...', body);

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ? body.likes : 0,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
    new: true,
    runValidators: true,
    context: 'query',
  });
  info('updated fetch...', updatedBlog);

  res.json(updatedBlog);
});

blogsRouter.delete('/:id', async (req, res) => {
  info('start of delete router');
  info(config.SECRET);
  info('token: ', req.token);
  const decodedToken = jwt.verify(req.token, config.SECRET);

  info('decoded token: ', decodedToken.id);

  const blog = await Blog.findById(req.params.id);
  const user = await User.findById(blog.user.toString());
  info('blog: ', blog);

  if (decodedToken.id !== user.id) {
    return res.status(401).json({
      error: 'authorization denied'
    });
  }

  if (!decodedToken.id) {
    return res.status(401).json({
      error: 'missing or invalid token'
    });
  }

  info('user.blogs: ', user.blogs);
  const updatedBlogList = user.blogs.filter(blog => {
    info('each blog: ', blog);
    if (blog !== blog._id) {
      return blog;
    }
  });
  info('updated blog list: ', updatedBlogList);
  user.blogs = updatedBlogList;

  await user.save();
  await Blog.findByIdAndRemove(req.params.id);
  res.status(204).end();
});

module.exports = blogsRouter;
