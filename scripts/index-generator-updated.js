const pagination = require('hexo-pagination');

function timestamp(post) {
  const value = post.updated || post.date;
  if (!value) return 0;
  if (typeof value.valueOf === 'function') return value.valueOf();
  return new Date(value).getTime();
}

hexo.extend.generator.register('index', function(locals) {
  const config = this.config;
  const posts = locals.posts;
  const paginationDir = config.pagination_dir || 'page';

  posts.data = posts.data.sort(function(a, b) {
    return timestamp(b) - timestamp(a);
  });

  return pagination('', posts, {
    perPage: config.index_generator.per_page,
    layout: ['index', 'archive'],
    format: paginationDir + '/%d/',
    data: {
      __index: true
    }
  });
});
