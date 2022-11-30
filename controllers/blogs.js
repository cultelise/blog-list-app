const blogsRouter = require('express').Router()

const Blog = require('../models/blog')

blogsRouter.get('/', (req, res) => {
  Blog
    .find({})
    .then(blogs => {
      res.json(blogs)
    })
})

blogsRouter.get('/:id', (req, res, next) => {
  Blog
  .findById(req.params.id)
  .then(blog => {
    console.log(blog)
    res.json(blog)
  })
})

blogsRouter.post('/', (req, res) => {
  const blog = new Blog(req.body)

  blog
    .save()
    .then(result => {
      res.status(201).json(result)
    })
})

module.exports = blogsRouter
