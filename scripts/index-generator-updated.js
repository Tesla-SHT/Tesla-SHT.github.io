const pagination = require('hexo-pagination');

function timestamp(post) {
  const value = post.updated || post.date;
  if (!value) return 0;
  if (typeof value.valueOf === 'function') return value.valueOf();
  return new Date(value).getTime();
}

function topRank(post) {
  if (!post.top) return 0;
  if (post.top === true) return 1;

  const rank = Number(post.top);
  return Number.isFinite(rank) ? rank : 1;
}

function generateIndex(locals) {
  const config = this.config;
  const posts = locals.posts;
  const paginationDir = config.pagination_dir || 'page';

  posts.data = posts.data.sort(function(a, b) {
    const topDiff = topRank(b) - topRank(a);
    if (topDiff !== 0) return topDiff;

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
}

hexo.extend.filter.register('before_generate', function() {
  hexo.extend.generator.register('index', generateIndex);
});
