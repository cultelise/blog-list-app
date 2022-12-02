const dummy = (blogs) => {
  console.log(blogs);
  return 1;
};

const totalLikes = (blogList) => {
  const likeArray = blogList.map((blog) => {
    return blog.likes;
  });
  console.log(likeArray);
  if (likeArray.length === 0) {
    return 0;
  } else if (likeArray.length < 2) {
    return likeArray[0];
  } else {
    return likeArray.reduce((total, current) => {
      return total + current;
    }, 0);
  }
};

const favoriteBlog = (blogList) => {
  const likeArray = blogList.map((blog) => {
    return blog.likes;
  });
  const getGreatestNumber = (array) => {
    return array.reduce((greatest, current) => {
      return greatest >= current ? greatest : current;
    });
  };
  const getGreatestLikes = () => {
    if (likeArray.length === 0) {
      return 0;
    } else if (likeArray.length < 2) {
      return likeArray[0];
    } else return getGreatestNumber(likeArray);
  };

  const [greatestBlog] = blogList.filter((blog) => {
    return blog.likes === getGreatestLikes();
  });

  return greatestBlog;
};

const mostBloggedAuthor = (blogList) => {
  const blogArray = blogList.map(blog => {
    return blog.blogs;
  });

  const findGreatestNumber = (array) => {
    return array.reduce((greatest, current) => {
      return greatest >= current ? greatest : current;
    });
  };

  const findGreatestBlog = () => {
    if (blogArray.length === 0) {
      return 0;
    } else if (blogArray.length < 2) {
      return blogArray[0];
    } else return findGreatestNumber(blogArray);
  };

  const [greatestBlogger] = blogList.filter((blog) => {
    return blog.blogs === findGreatestBlog();
  });

  return {author: greatestBlogger.author, blogs: greatestBlogger.blogs, title: greatestBlogger.title};
};

const mostLikes = (blogList) => {
  const likeArray = blogList.map((blog) => {
    return blog.likes;
  });
  const getGreatestNumber = (array) => {
    return array.reduce((greatest, current) => {
      return greatest >= current ? greatest : current;
    });
  };
  const getGreatestLikes = () => {
    if (likeArray.length === 0) {
      return 0;
    } else if (likeArray.length < 2) {
      return likeArray[0];
    } else return getGreatestNumber(likeArray);
  };

  const [greatestBlog] = blogList.filter((blog) => {
    return blog.likes === getGreatestLikes();
  });

  return {author: greatestBlog.author, likes: greatestBlog.likes};
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBloggedAuthor,
  mostLikes
};
