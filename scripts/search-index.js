'use strict';

function decodeEntities(value) {
  return String(value || '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripHtml(value) {
  return decodeEntities(value)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
}

function normalizeText(value) {
  return stripHtml(value)
    .replace(/\s+/g, ' ')
    .trim();
}

function collectionNames(collection) {
  if (!collection) return [];

  const data = Array.isArray(collection.data)
    ? collection.data
    : Array.isArray(collection)
      ? collection
      : [];

  return data
    .map(function(item) {
      return item && (item.name || item.slug || item.path || String(item));
    })
    .filter(Boolean);
}

function dateText(value) {
  if (!value) return '';
  if (typeof value.format === 'function') return value.format('YYYY-MM-DD');
  return String(value);
}

function timestamp(value) {
  if (!value) return 0;
  if (typeof value.valueOf === 'function') return value.valueOf();
  return new Date(value).getTime() || 0;
}

function rootUrl(root, postPath) {
  const base = root && root.endsWith('/') ? root : `${root || '/'}/`;
  return base + String(postPath || '').replace(/^\/+/, '');
}

hexo.extend.generator.register('search-index', function(locals) {
  const root = this.config.root || '/';
  const posts = locals.posts.data
    .slice()
    .filter(function(post) {
      return post.published !== false;
    })
    .sort(function(a, b) {
      return timestamp(b.updated || b.date) - timestamp(a.updated || a.date);
    });

  const data = posts.map(function(post) {
    const title = normalizeText(post.title);
    const content = normalizeText(post.content).slice(0, 20000);
    const excerpt = normalizeText(post.excerpt || post.more || content).slice(0, 240);

    return {
      title: title || 'Untitled',
      url: rootUrl(root, post.path),
      date: dateText(post.date),
      updated: dateText(post.updated),
      tags: collectionNames(post.tags),
      categories: collectionNames(post.categories),
      excerpt,
      content
    };
  });

  return {
    path: 'search.json',
    data: JSON.stringify(data)
  };
});
