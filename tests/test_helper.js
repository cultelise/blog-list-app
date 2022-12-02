const Blog = require('../models/blog');

const blogsInDb = async () => {
  const blogs = await Blog.find({});

  return blogs.map((blog) => {
    return blog.toJSON();
  });
};

const postToDb = () => {
  const blogs = [
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
  ];
  Promise.all(
    blogs.map(async (blog) => {
      const blogObject = new Blog(blog);
      await blogObject.save();
    })
  );
};

module.exports = {
  blogsInDb,
  postToDb
};
